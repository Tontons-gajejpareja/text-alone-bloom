-- Create navi_settings table with all toggles and adaptive thresholds
CREATE TABLE public.navi_settings (
  id text PRIMARY KEY DEFAULT 'global',
  -- Authority toggles
  disable_signups boolean DEFAULT false,
  read_only_mode boolean DEFAULT false,
  maintenance_mode boolean DEFAULT false,
  disable_messages boolean DEFAULT false,
  vip_only_mode boolean DEFAULT false,
  lockdown_mode boolean DEFAULT false,
  maintenance_message text,
  
  -- Auto-moderation toggles
  auto_warn_enabled boolean DEFAULT true,
  auto_temp_ban_enabled boolean DEFAULT true,
  auto_lockdown_enabled boolean DEFAULT true,
  
  -- Auto-messaging toggles
  welcome_messages_enabled boolean DEFAULT true,
  degraded_service_messages_enabled boolean DEFAULT true,
  warning_messages_enabled boolean DEFAULT true,
  
  -- Push notification toggles
  push_critical_enabled boolean DEFAULT true,
  push_warning_enabled boolean DEFAULT true,
  push_recovery_enabled boolean DEFAULT true,
  
  -- Auto authority action toggles
  auto_disable_signups boolean DEFAULT true,
  auto_read_only_mode boolean DEFAULT true,
  auto_vip_only_mode boolean DEFAULT false,
  
  -- Threshold settings
  signup_threshold integer DEFAULT 10,
  message_threshold integer DEFAULT 50,
  failed_login_threshold integer DEFAULT 15,
  lockdown_multiplier integer DEFAULT 10,
  
  -- Adaptive threshold settings
  adaptive_thresholds_enabled boolean DEFAULT true,
  signup_rolling_avg integer DEFAULT 10,
  message_rolling_avg integer DEFAULT 50,
  failed_login_rolling_avg integer DEFAULT 15,
  last_threshold_adjustment timestamptz DEFAULT now(),
  
  updated_at timestamptz DEFAULT now(),
  updated_by uuid
);

-- Insert default settings
INSERT INTO public.navi_settings (id) VALUES ('global');

-- Create navi_auto_actions table for logging NAVI actions
CREATE TABLE public.navi_auto_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL, -- 'warn', 'temp_ban', 'lockdown', 'unlock', 'message', 'threshold_adjust'
  target_user_id uuid,
  reason text NOT NULL,
  trigger_stats jsonb DEFAULT '{}'::jsonb,
  threat_level text, -- 'normal', 'elevated', 'warning', 'critical', 'emergency'
  created_at timestamptz DEFAULT now(),
  reversed boolean DEFAULT false,
  reversed_at timestamptz,
  reversed_by uuid
);

-- Create user_first_login table for welcome messages
CREATE TABLE public.user_first_login (
  user_id uuid PRIMARY KEY,
  welcomed boolean DEFAULT false,
  welcomed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create navi_threshold_history for adaptive threshold learning
CREATE TABLE public.navi_threshold_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL, -- 'signups', 'messages', 'failed_logins'
  value integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.navi_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navi_auto_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_first_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navi_threshold_history ENABLE ROW LEVEL SECURITY;

-- RLS for navi_settings
CREATE POLICY "Anyone can read navi settings"
ON public.navi_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update navi settings"
ON public.navi_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS for navi_auto_actions
CREATE POLICY "Admins can view all navi actions"
ON public.navi_auto_actions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view actions targeting them"
ON public.navi_auto_actions FOR SELECT
USING (auth.uid() = target_user_id);

CREATE POLICY "System can insert navi actions"
ON public.navi_auto_actions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update navi actions"
ON public.navi_auto_actions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS for user_first_login
CREATE POLICY "Users can view own first login"
ON public.user_first_login FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert first login"
ON public.user_first_login FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update first login"
ON public.user_first_login FOR UPDATE
USING (true);

-- RLS for navi_threshold_history
CREATE POLICY "Admins can view threshold history"
ON public.navi_threshold_history FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert threshold history"
ON public.navi_threshold_history FOR INSERT
WITH CHECK (true);

-- Create function to record threshold history periodically
CREATE OR REPLACE FUNCTION public.record_navi_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_five_min_ago timestamptz := now() - interval '5 minutes';
  v_signups integer;
  v_messages integer;
  v_failed_logins integer;
BEGIN
  SELECT COUNT(*) INTO v_signups FROM monitoring_events 
  WHERE event_type = 'signup' AND created_at >= v_five_min_ago;
  
  SELECT COUNT(*) INTO v_messages FROM monitoring_events 
  WHERE event_type = 'message' AND created_at >= v_five_min_ago;
  
  SELECT COUNT(*) INTO v_failed_logins FROM monitoring_events 
  WHERE event_type = 'failed_login' AND created_at >= v_five_min_ago;
  
  INSERT INTO navi_threshold_history (metric_type, value) VALUES ('signups', v_signups);
  INSERT INTO navi_threshold_history (metric_type, value) VALUES ('messages', v_messages);
  INSERT INTO navi_threshold_history (metric_type, value) VALUES ('failed_logins', v_failed_logins);
END;
$$;

-- Create function to adjust thresholds based on rolling average
CREATE OR REPLACE FUNCTION public.adjust_navi_thresholds()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_24h_ago timestamptz := now() - interval '24 hours';
  v_signup_avg integer;
  v_message_avg integer;
  v_login_avg integer;
  v_current_settings RECORD;
BEGIN
  SELECT * INTO v_current_settings FROM navi_settings WHERE id = 'global';
  
  IF NOT v_current_settings.adaptive_thresholds_enabled THEN
    RETURN;
  END IF;
  
  -- Calculate 24h rolling averages
  SELECT COALESCE(AVG(value), 10) INTO v_signup_avg 
  FROM navi_threshold_history 
  WHERE metric_type = 'signups' AND recorded_at >= v_24h_ago;
  
  SELECT COALESCE(AVG(value), 50) INTO v_message_avg 
  FROM navi_threshold_history 
  WHERE metric_type = 'messages' AND recorded_at >= v_24h_ago;
  
  SELECT COALESCE(AVG(value), 15) INTO v_login_avg 
  FROM navi_threshold_history 
  WHERE metric_type = 'failed_logins' AND recorded_at >= v_24h_ago;
  
  -- Only adjust if averages are at least 20% different from current thresholds
  -- And cap adjustments to prevent runaway growth
  UPDATE navi_settings SET
    signup_rolling_avg = LEAST(v_signup_avg, 100),
    message_rolling_avg = LEAST(v_message_avg, 500),
    failed_login_rolling_avg = LEAST(v_login_avg, 100),
    signup_threshold = GREATEST(5, LEAST(v_signup_avg * 1.5, 100))::integer,
    message_threshold = GREATEST(20, LEAST(v_message_avg * 1.5, 500))::integer,
    failed_login_threshold = GREATEST(10, LEAST(v_login_avg * 1.5, 100))::integer,
    last_threshold_adjustment = now()
  WHERE id = 'global'
  AND (
    ABS(v_signup_avg - signup_rolling_avg) > signup_rolling_avg * 0.2
    OR ABS(v_message_avg - message_rolling_avg) > message_rolling_avg * 0.2
    OR ABS(v_login_avg - failed_login_rolling_avg) > failed_login_rolling_avg * 0.2
  );
END;
$$;

-- Create trigger for updated_at on navi_settings
CREATE TRIGGER update_navi_settings_updated_at
BEFORE UPDATE ON public.navi_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
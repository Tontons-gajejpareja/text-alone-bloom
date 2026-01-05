import { useState } from "react";
import { 
  Bot, Shield, Zap, Activity, Bell, Power, 
  AlertTriangle, Clock, Cpu, Eye, BellRing,
  MessageSquare, Users, Lock, Settings, Undo2,
  TrendingUp, RefreshCw, ToggleLeft, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNaviAutonomous, requestNotificationPermission, sendPushNotification, ThreatLevel } from "@/hooks/useNaviAutonomous";
import { toast } from "sonner";

export const NaviAutonomousPanel = () => {
  const { 
    stats, 
    settings,
    recentActions, 
    isMonitoring,
    threatLevel,
    updateSettings,
    toggleMonitoring,
    reverseAction,
    refresh
  } = useNaviAutonomous();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );
  const [autoModOpen, setAutoModOpen] = useState(true);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authorityOpen, setAuthorityOpen] = useState(false);
  const [thresholdsOpen, setThresholdsOpen] = useState(false);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      toast.success('Push notifications enabled');
      sendPushNotification('NAVI Notifications Enabled', 'You will now receive alerts from NAVI');
    } else {
      toast.error('Notification permission denied');
    }
  };

  const handleTestNotification = () => {
    sendPushNotification('🤖 NAVI Test', 'This is a test notification from NAVI');
    toast.success('Test notification sent');
  };

  const getThreatLevelDisplay = (level: ThreatLevel) => {
    const displays = {
      normal: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'NORMAL' },
      elevated: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'ELEVATED' },
      warning: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'WARNING' },
      critical: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'CRITICAL' },
      emergency: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'EMERGENCY' }
    };
    return displays[level] || displays.normal;
  };

  const display = getThreatLevelDisplay(threatLevel);

  return (
    <div className="space-y-4">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${display.bg} border border-current/30 flex items-center justify-center ${display.color}`}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              NAVI Autonomous
              {isMonitoring && (
                <span className="flex items-center gap-1 text-xs text-green-400 font-mono">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  ACTIVE
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              Rule-based threat detection & auto-response
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button 
            onClick={toggleMonitoring} 
            variant={isMonitoring ? "default" : "outline"} 
            size="sm"
            className="gap-2"
          >
            <Power className="w-4 h-4" />
            {isMonitoring ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Threat Level Display */}
      <div className={`p-4 rounded-xl ${display.bg} border border-current/30 ${display.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">
                Threat Level: {display.label}
              </div>
              <div className="text-xs opacity-70">
                {threatLevel === 'normal' && 'All systems operating within normal parameters'}
                {threatLevel === 'elevated' && 'Activity slightly elevated - monitoring closely'}
                {threatLevel === 'warning' && '2x threshold - protective measures may activate'}
                {threatLevel === 'critical' && '5x threshold - auto-warning top offenders'}
                {threatLevel === 'emergency' && `${settings.lockdown_multiplier}x threshold - LOCKDOWN ACTIVE`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stats.velocityRatio > 1.5 && (
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3" />
                {stats.velocityRatio.toFixed(1)}x
              </div>
            )}
            <div className={`w-3 h-3 rounded-full ${display.color.replace('text-', 'bg-')} animate-pulse`} />
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          icon={Users}
          label="Signups"
          value={stats.signupsLast5Min}
          threshold={settings.signup_threshold}
          lockdownMultiplier={settings.lockdown_multiplier}
        />
        <MetricCard
          icon={MessageSquare}
          label="Messages"
          value={stats.messagesLast5Min}
          threshold={settings.message_threshold}
          lockdownMultiplier={settings.lockdown_multiplier}
        />
        <MetricCard
          icon={Lock}
          label="Failed Logins"
          value={stats.failedLogins}
          threshold={settings.failed_login_threshold}
          lockdownMultiplier={settings.lockdown_multiplier}
        />
      </div>

      {/* Toggleable Sections */}
      <div className="space-y-2">
        {/* Auto-Moderation Toggles */}
        <Collapsible open={autoModOpen} onOpenChange={setAutoModOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-medium">Auto-Moderation</span>
              </div>
              {autoModOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 space-y-3">
            <ToggleRow
              label="Auto-Warn Users"
              description="Automatically warn users at 5x threshold"
              checked={settings.auto_warn_enabled}
              onToggle={(v) => updateSettings({ auto_warn_enabled: v })}
            />
            <ToggleRow
              label="Auto Temp-Ban"
              description="Temp-ban top offenders during emergencies"
              checked={settings.auto_temp_ban_enabled}
              onToggle={(v) => updateSettings({ auto_temp_ban_enabled: v })}
            />
            <ToggleRow
              label="Auto Lockdown"
              description={`Lock site at ${settings.lockdown_multiplier}x threshold`}
              checked={settings.auto_lockdown_enabled}
              onToggle={(v) => updateSettings({ auto_lockdown_enabled: v })}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Messaging Toggles */}
        <Collapsible open={messagingOpen} onOpenChange={setMessagingOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">Auto-Messaging</span>
              </div>
              {messagingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 space-y-3">
            <ToggleRow
              label="Welcome Messages"
              description="Send welcome message to new users"
              checked={settings.welcome_messages_enabled}
              onToggle={(v) => updateSettings({ welcome_messages_enabled: v })}
            />
            <ToggleRow
              label="Degraded Service Notices"
              description="Notify users during emergencies"
              checked={settings.degraded_service_messages_enabled}
              onToggle={(v) => updateSettings({ degraded_service_messages_enabled: v })}
            />
            <ToggleRow
              label="Warning Messages"
              description="Send warning messages to flagged users"
              checked={settings.warning_messages_enabled}
              onToggle={(v) => updateSettings({ warning_messages_enabled: v })}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Push Notification Toggles */}
        <Collapsible open={notifOpen} onOpenChange={setNotifOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-purple-400" />
                <span className="font-medium">Push Notifications</span>
              </div>
              {notifOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 space-y-3">
            {!notificationsEnabled ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Enable browser notifications</span>
                <Button size="sm" onClick={handleEnableNotifications}>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable
                </Button>
              </div>
            ) : (
              <>
                <ToggleRow
                  label="Critical Alerts"
                  description="Lockdown and emergency notifications"
                  checked={settings.push_critical_enabled}
                  onToggle={(v) => updateSettings({ push_critical_enabled: v })}
                />
                <ToggleRow
                  label="Warning Alerts"
                  description="Threshold approaching notifications"
                  checked={settings.push_warning_enabled}
                  onToggle={(v) => updateSettings({ push_warning_enabled: v })}
                />
                <ToggleRow
                  label="Recovery Alerts"
                  description="Notify when threat level normalizes"
                  checked={settings.push_recovery_enabled}
                  onToggle={(v) => updateSettings({ push_recovery_enabled: v })}
                />
                <Button variant="outline" size="sm" onClick={handleTestNotification} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Test Notification
                </Button>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Authority Auto-Toggle */}
        <Collapsible open={authorityOpen} onOpenChange={setAuthorityOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <ToggleLeft className="w-4 h-4 text-red-400" />
                <span className="font-medium">Auto-Authority Actions</span>
              </div>
              {authorityOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 space-y-3">
            <ToggleRow
              label="Auto-Disable Signups"
              description="Disable signups at 2x threshold"
              checked={settings.auto_disable_signups}
              onToggle={(v) => updateSettings({ auto_disable_signups: v })}
            />
            <ToggleRow
              label="Auto Read-Only Mode"
              description="Enable read-only at 2x message threshold"
              checked={settings.auto_read_only_mode}
              onToggle={(v) => updateSettings({ auto_read_only_mode: v })}
            />
            <ToggleRow
              label="Auto VIP-Only Mode"
              description="Restrict to VIPs during emergencies"
              checked={settings.auto_vip_only_mode}
              onToggle={(v) => updateSettings({ auto_vip_only_mode: v })}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Threshold Settings */}
        <Collapsible open={thresholdsOpen} onOpenChange={setThresholdsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Thresholds</span>
                {settings.adaptive_thresholds_enabled && (
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">ADAPTIVE</span>
                )}
              </div>
              {thresholdsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 space-y-4">
            <ToggleRow
              label="Adaptive Thresholds"
              description="Auto-adjust based on 24h rolling average"
              checked={settings.adaptive_thresholds_enabled}
              onToggle={(v) => updateSettings({ adaptive_thresholds_enabled: v })}
            />
            
            <ThresholdSlider
              label="Signup Threshold"
              value={settings.signup_threshold}
              rollingAvg={settings.signup_rolling_avg}
              min={5}
              max={100}
              onChange={(v) => updateSettings({ signup_threshold: v })}
            />
            <ThresholdSlider
              label="Message Threshold"
              value={settings.message_threshold}
              rollingAvg={settings.message_rolling_avg}
              min={20}
              max={500}
              onChange={(v) => updateSettings({ message_threshold: v })}
            />
            <ThresholdSlider
              label="Failed Login Threshold"
              value={settings.failed_login_threshold}
              rollingAvg={settings.failed_login_rolling_avg}
              min={5}
              max={100}
              onChange={(v) => updateSettings({ failed_login_threshold: v })}
            />
            <ThresholdSlider
              label="Lockdown Multiplier"
              value={settings.lockdown_multiplier}
              min={5}
              max={20}
              onChange={(v) => updateSettings({ lockdown_multiplier: v })}
              suffix="x"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Recent NAVI Actions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Eye className="w-4 h-4 text-cyan-400" />
          Recent NAVI Actions
        </div>

        <ScrollArea className="h-[180px] rounded-lg border border-slate-800 bg-slate-900/50">
          {recentActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <Bot className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No autonomous actions taken yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {recentActions.map(action => (
                <div 
                  key={action.id}
                  className={`p-3 rounded-lg border ${
                    action.reversed 
                      ? 'bg-slate-500/10 border-slate-500/30 opacity-60'
                      : action.threat_level === 'emergency' 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : action.threat_level === 'critical'
                          ? 'bg-orange-500/10 border-orange-500/30'
                          : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Zap className={`w-4 h-4 mt-0.5 ${
                      action.reversed ? 'text-slate-400' : 'text-amber-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{action.action_type.replace(/_/g, ' ')}</span>
                        {action.threat_level && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            getThreatLevelDisplay(action.threat_level as ThreatLevel).bg
                          } ${getThreatLevelDisplay(action.threat_level as ThreatLevel).color}`}>
                            {action.threat_level.toUpperCase()}
                          </span>
                        )}
                        {action.reversed && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-500/30 text-slate-400 font-mono">
                            REVERSED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{action.reason}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(action.created_at).toLocaleTimeString()}
                        </div>
                        {!action.reversed && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => reverseAction(action.id, 'Manual reversal by admin')}
                          >
                            <Undo2 className="w-3 h-3 mr-1" />
                            Undo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Info Box */}
      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <div className="flex items-start gap-2">
          <Bot className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-400">
            <span className="font-bold text-cyan-400">NAVI Autonomous</span> uses rule-based detection. 
            At 2x threshold: protective measures. At 5x: auto-warn offenders. 
            At {settings.lockdown_multiplier}x: emergency lockdown + temp-bans.
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Row Component
const ToggleRow = ({ 
  label, 
  description, 
  checked, 
  onToggle 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onToggle: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
    <Switch checked={checked} onCheckedChange={onToggle} />
  </div>
);

// Metric Card Component
const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  threshold,
  lockdownMultiplier
}: { 
  icon: any; 
  label: string; 
  value: number; 
  threshold: number;
  lockdownMultiplier: number;
}) => {
  const ratio = value / threshold;
  const isWarning = ratio >= 1;
  const isCritical = ratio >= 2;
  const isEmergency = ratio >= lockdownMultiplier;

  return (
    <div className={`p-3 rounded-xl border ${
      isEmergency 
        ? 'bg-red-500/10 border-red-500/30 text-red-400'
        : isCritical 
          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
          : isWarning
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-slate-800/50 border-slate-700 text-slate-300'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-[10px] font-mono uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isEmergency ? 'bg-red-500' : isCritical ? 'bg-orange-500' : isWarning ? 'bg-amber-500' : 'bg-slate-600'
            }`}
            style={{ width: `${Math.min(ratio * 50, 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono opacity-70">/{threshold}</span>
      </div>
      {isEmergency && (
        <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
          <AlertTriangle className="w-3 h-3" />
          {lockdownMultiplier}x LOCKDOWN
        </div>
      )}
    </div>
  );
};

// Threshold Slider Component
const ThresholdSlider = ({
  label,
  value,
  rollingAvg,
  min,
  max,
  onChange,
  suffix = ''
}: {
  label: string;
  value: number;
  rollingAvg?: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix?: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {rollingAvg !== undefined && (
          <span className="text-[10px] text-cyan-400 font-mono">avg: {rollingAvg}</span>
        )}
        <span className="font-mono text-sm text-cyan-400">{value}{suffix}</span>
      </div>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={1}
      onValueChange={([v]) => onChange(v)}
      className="py-1"
    />
  </div>
);

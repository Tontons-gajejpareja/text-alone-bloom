import { useState, useEffect } from 'react';
import { Award, Trophy, Star, Calendar, Crown, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CertificateProps {
  seasonKey?: string;
}

export const BattlePassCertificate = ({ seasonKey = 'genesis_2025' }: CertificateProps) => {
  const [username, setUsername] = useState<string>('Operator');
  const [completedAt, setCompletedAt] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUsername(profile.display_name || profile.username);
      }

      const { data: bp } = await supabase
        .from('user_battlepass')
        .select('*, battlepass_seasons!inner(*)')
        .eq('user_id', user.id)
        .eq('current_level', 100)
        .single();

      if (bp) {
        setCompletedAt(new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }));
      }
    };

    fetchData();
  }, []);

  const seasonName = seasonKey === 'genesis_2025' ? 'Genesis' : 'Phantom Protocol';
  const seasonYear = '2025';

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Certificate Frame */}
      <div className="relative max-w-2xl w-full aspect-[4/3] bg-gradient-to-br from-amber-900/20 via-slate-800 to-amber-900/20 rounded-2xl border-4 border-amber-500/30 p-8 shadow-2xl shadow-amber-500/10">
        {/* Decorative Corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-amber-500/50" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-amber-500/50" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-amber-500/50" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-amber-500/50" />

        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <span className="text-amber-500/80 text-sm font-medium tracking-widest uppercase">
              Certificate of Achievement
            </span>
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>

          {/* Season Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Season {seasonName}
            </h1>
            <p className="text-amber-500/60 text-sm">Battle Pass Complete</p>
          </div>

          {/* Divider */}
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          {/* Username */}
          <div className="space-y-1">
            <p className="text-slate-400 text-sm">This certifies that</p>
            <p className="text-3xl font-bold text-white">{username}</p>
            <p className="text-slate-400 text-sm">has achieved Level 100</p>
          </div>

          {/* Achievement Icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">{seasonName} Champion</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Completed: {completedAt || 'In Progress'}</span>
          </div>

          {/* Seal */}
          <div className="absolute bottom-12 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 text-xs">
            UrbanShade OS • Season {seasonYear}
          </div>
        </div>
      </div>
    </div>
  );
};

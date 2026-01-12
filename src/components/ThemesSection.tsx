import { useState } from 'react';
import { Palette, Lock, Check, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useThemePresets, ThemePreset } from '@/hooks/useThemePresets';
import { useBattlePass } from '@/hooks/useBattlePass';
import { toast } from 'sonner';

interface ThemesSectionProps {
  userId?: string;
}

export const ThemesSection = ({ userId }: ThemesSectionProps) => {
  const { presets, applyPreset } = useThemePresets();
  const { progress } = useBattlePass(userId);
  const [activeTheme, setActiveTheme] = useState<string>(() => 
    localStorage.getItem('active_theme_preset') || 'urbanshade-dark'
  );

  // Get all themes (base + battlepass)
  const baseThemes = presets.filter(p => p.source === 'default');
  const bpThemes = presets.filter(p => p.source === 'battlepass');

  // Check if a BP theme is unlocked
  const isBpThemeUnlocked = (theme: ThemePreset): boolean => {
    if (!theme.requiredLevel || !progress) return false;
    return progress.current_level >= theme.requiredLevel;
  };

  const handleThemeSelect = (theme: ThemePreset) => {
    if (theme.source === 'battlepass' && !isBpThemeUnlocked(theme)) {
      toast.error(`Reach Battle Pass Level ${theme.requiredLevel} to unlock this theme`);
      return;
    }

    applyPreset(theme);
    setActiveTheme(theme.id);
    localStorage.setItem('active_theme_preset', theme.id);
  };

  const ThemeCard = ({ theme, locked = false }: { theme: ThemePreset; locked?: boolean }) => {
    const isActive = activeTheme === theme.id;
    
    return (
      <button
        onClick={() => handleThemeSelect(theme)}
        disabled={locked}
        className={`relative p-4 rounded-xl border transition-all text-left ${
          isActive
            ? 'bg-primary/10 border-primary/50 ring-2 ring-primary/30'
            : locked
              ? 'bg-muted/20 border-border/30 opacity-60 cursor-not-allowed'
              : 'bg-card/50 border-border/50 hover:bg-card/80 hover:border-border'
        }`}
      >
        {/* Color Preview */}
        <div className="flex gap-1 mb-3">
          <div 
            className="w-6 h-6 rounded-md border border-white/10" 
            style={{ backgroundColor: theme.colors.bgGradientStart }}
          />
          <div 
            className="w-6 h-6 rounded-md border border-white/10" 
            style={{ backgroundColor: theme.colors.bgGradientEnd }}
          />
          {theme.colors.accentColor && (
            <div 
              className="w-6 h-6 rounded-md border border-white/10" 
              style={{ backgroundColor: theme.colors.accentColor }}
            />
          )}
        </div>

        {/* Theme Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{theme.name}</p>
            {theme.requiredLevel && (
              <p className="text-xs text-muted-foreground">Level {theme.requiredLevel}</p>
            )}
          </div>
          
          {locked ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : isActive ? (
            <Check className="w-4 h-4 text-primary" />
          ) : null}
        </div>

        {/* BP Badge */}
        {theme.source === 'battlepass' && (
          <Badge 
            className="absolute top-2 right-2 text-[9px] bg-amber-500/20 text-amber-400 border-amber-500/30"
          >
            <Star className="w-2.5 h-2.5 mr-0.5" />
            BP
          </Badge>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Theme Presets</h3>
          <p className="text-sm text-muted-foreground">Instantly change your system look</p>
        </div>
      </div>

      {/* Base Themes */}
      <div>
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Standard Themes</h4>
        <div className="grid grid-cols-2 gap-3">
          {baseThemes.map(theme => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </div>

      {/* Battle Pass Themes */}
      {bpThemes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-amber-400">Battle Pass Exclusive</span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {bpThemes.map(theme => (
              <ThemeCard 
                key={theme.id} 
                theme={theme} 
                locked={!isBpThemeUnlocked(theme)}
              />
            ))}
          </div>
          
          {!userId && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Sign in and level up your Battle Pass to unlock exclusive themes
            </p>
          )}
        </div>
      )}
    </div>
  );
};

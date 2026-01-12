import { useState } from 'react';
import { 
  Trophy, Star, Gift, Lock, Check, Clock, ChevronRight, 
  Sparkles, Flame, Crown, Zap, AlertCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useBattlePass } from '@/hooks/useBattlePass';
import { useQuests } from '@/hooks/useQuests';
import { RARITY_CONFIG } from '@/lib/quests';

interface BattlePassTabProps {
  userId?: string;
}

export const BattlePassTab = ({ userId }: BattlePassTabProps) => {
  const [subTab, setSubTab] = useState<'overview' | 'rewards' | 'quests'>('overview');
  
  const { 
    season, 
    progress, 
    loading: bpLoading, 
    getLevelProgress, 
    getXpNeeded, 
    getTimeRemaining,
    claimReward,
    canClaimReward,
    isRewardUnlocked
  } = useBattlePass(userId);
  
  const { 
    quests, 
    loading: questsLoading, 
    getTimeUntilReset, 
    getCompletedCount,
    questStreak
  } = useQuests(userId);

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">Sign in to access Battle Pass</p>
        <p className="text-sm mt-1">Go to Settings → Account to sign in</p>
      </div>
    );
  }

  if (bpLoading || questsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!season) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <Trophy className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">No Active Season</p>
        <p className="text-sm mt-1">Check back later for the next Battle Pass!</p>
      </div>
    );
  }

  const levelProgress = getLevelProgress();
  const xpNeeded = getXpNeeded();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header Stats */}
      <div className="flex-shrink-0 mb-4 space-y-4">
        {/* Season Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{season.name}</h2>
                <p className="text-sm text-muted-foreground">{season.description}</p>
              </div>
            </div>
            {timeRemaining && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {timeRemaining}
              </div>
            )}
          </div>
        </div>

        {/* Level Progress */}
        <div className="p-4 rounded-xl bg-card/50 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-xl font-black text-primary-foreground">
                  {progress?.current_level || 1}
                </div>
                {(progress?.current_level || 1) >= 50 && (
                  <Crown className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-xs text-muted-foreground">
                  {progress?.current_xp || 0} / {xpNeeded} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{progress?.total_xp_earned || 0}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </div>

        {/* Quest Streak */}
        {questStreak > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400">Quest Streak: {questStreak}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={subTab} onValueChange={(v) => setSubTab(v as any)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full grid grid-cols-3 mb-4 flex-shrink-0">
          <TabsTrigger value="overview" className="text-xs gap-1">
            <Sparkles className="w-3 h-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="rewards" className="text-xs gap-1">
            <Gift className="w-3 h-3" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="quests" className="text-xs gap-1">
            <Zap className="w-3 h-3" />
            Quests
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-2xl font-bold text-primary">{progress?.current_level || 1}</p>
                  <p className="text-xs text-muted-foreground">Current Level</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-2xl font-bold text-green-500">{getCompletedCount()}/{quests.length}</p>
                  <p className="text-xs text-muted-foreground">Quests Done</p>
                </div>
              </div>

              {/* Active Quests Preview */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Active Quests
                  <span className="text-xs text-muted-foreground ml-auto">
                    Resets in {getTimeUntilReset()}
                  </span>
                </h3>
                <div className="space-y-2">
                  {quests.slice(0, 3).map(quest => {
                    const rarityConfig = RARITY_CONFIG[quest.rarity as keyof typeof RARITY_CONFIG];
                    const progressPercent = (quest.progress / quest.target) * 100;
                    
                    return (
                      <div 
                        key={quest.id}
                        className={`p-3 rounded-lg border ${quest.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/20 border-border/50'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{quest.quest_name}</span>
                            <Badge 
                              variant="outline" 
                              className="text-[9px] px-1"
                              style={{ borderColor: rarityConfig?.color, color: rarityConfig?.color }}
                            >
                              {quest.rarity}
                            </Badge>
                          </div>
                          {quest.completed ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <span className="text-xs text-muted-foreground">{quest.progress}/{quest.target}</span>
                          )}
                        </div>
                        <Progress value={progressPercent} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Rewards */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-500" />
                  Upcoming Rewards
                </h3>
                <div className="space-y-2">
                  {season.rewards
                    .filter(r => r.level > (progress?.current_level || 0))
                    .slice(0, 3)
                    .map(reward => (
                      <div 
                        key={reward.level}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                          {reward.level}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{reward.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{reward.type}</p>
                        </div>
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2 pr-4">
              {season.rewards.map(reward => {
                const unlocked = isRewardUnlocked(reward.level);
                const canClaim = canClaimReward(reward.level);
                const claimed = progress?.claimed_rewards.includes(reward.level);

                return (
                  <div 
                    key={reward.level}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      claimed 
                        ? 'bg-green-500/10 border-green-500/30'
                        : unlocked 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-muted/20 border-border/50 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      unlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {reward.level}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reward.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{reward.type}</p>
                    </div>

                    {claimed ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Check className="w-3 h-3 mr-1" />
                        Claimed
                      </Badge>
                    ) : canClaim ? (
                      <Button size="sm" onClick={() => claimReward(reward.level)}>
                        Claim
                      </Button>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Quests Tab */}
        <TabsContent value="quests" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-3 pr-4">
              {/* Reset Timer */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <span className="text-sm text-muted-foreground">New quests in</span>
                <span className="font-mono text-primary">{getTimeUntilReset()}</span>
              </div>

              {/* Quest List */}
              {quests.map(quest => {
                const rarityConfig = RARITY_CONFIG[quest.rarity as keyof typeof RARITY_CONFIG];
                const progressPercent = (quest.progress / quest.target) * 100;

                return (
                  <div 
                    key={quest.id}
                    className={`p-4 rounded-lg border transition-all ${
                      quest.completed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-muted/20 border-border/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{quest.quest_name}</span>
                          <Badge 
                            variant="outline"
                            style={{ borderColor: rarityConfig?.color, color: rarityConfig?.color }}
                          >
                            {quest.rarity}
                          </Badge>
                        </div>
                        {quest.quest_description && (
                          <p className="text-xs text-muted-foreground">{quest.quest_description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">+{quest.xp_reward}</p>
                        <p className="text-[10px] text-muted-foreground">XP</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Progress value={progressPercent} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        {quest.progress}/{quest.target}
                      </span>
                      {quest.completed && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

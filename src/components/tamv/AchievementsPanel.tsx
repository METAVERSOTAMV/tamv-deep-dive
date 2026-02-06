import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  category: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

const rarityColors: Record<string, string> = {
  common: 'border-gray-500 bg-gray-500/10',
  uncommon: 'border-green-500 bg-green-500/10',
  rare: 'border-blue-500 bg-blue-500/10',
  epic: 'border-purple-500 bg-purple-500/10',
  legendary: 'border-amber-500 bg-amber-500/10 animate-pulse',
};

const rarityLabels: Record<string, string> = {
  common: 'Común',
  uncommon: 'Poco común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
};

const categoryIcons: Record<string, typeof Award> = {
  social: Star,
  economy: Star,
  governance: Star,
  xr: Star,
  creator: Star,
  special: Trophy,
};

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: false });

    if (allAchievements) {
      setAchievements(allAchievements as Achievement[]);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userAch } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id);

      if (userAch) {
        setUserAchievements(userAch);
        
        const points = userAch.reduce((sum, ua) => {
          const ach = allAchievements?.find(a => a.id === ua.achievement_id);
          return sum + (ach?.points || 0);
        }, 0);
        setTotalPoints(points);
      }
    }

    setLoading(false);
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getUnlockedDate = (achievementId: string) => {
    const ua = userAchievements.find(u => u.achievement_id === achievementId);
    return ua ? new Date(ua.unlocked_at).toLocaleDateString() : null;
  };

  const unlockedCount = userAchievements.length;
  const progressPercent = achievements.length > 0 
    ? Math.round((unlockedCount / achievements.length) * 100)
    : 0;

  const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold">Logros</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{totalPoints}</p>
          <p className="text-xs text-muted-foreground">de {maxPoints} puntos</p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso total</span>
            <span className="text-sm text-muted-foreground">{unlockedCount}/{achievements.length}</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, i) => {
          const unlocked = isUnlocked(achievement.id);
          const unlockedDate = getUnlockedDate(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`relative overflow-hidden transition-all ${
                unlocked 
                  ? `${rarityColors[achievement.rarity]} border-2`
                  : 'bg-card/30 border-border/30 opacity-60'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-full ${
                      unlocked ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      {unlocked ? (
                        <Award className="w-6 h-6 text-primary" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{achievement.name}</h3>
                        {unlocked && (
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            achievement.rarity === 'legendary' ? 'text-amber-500 border-amber-500' :
                            achievement.rarity === 'epic' ? 'text-purple-500 border-purple-500' :
                            achievement.rarity === 'rare' ? 'text-blue-500 border-blue-500' :
                            achievement.rarity === 'uncommon' ? 'text-green-500 border-green-500' :
                            ''
                          }`}
                        >
                          {rarityLabels[achievement.rarity]}
                        </Badge>
                        <span className="text-xs text-primary font-medium">
                          +{achievement.points} pts
                        </span>
                      </div>
                      {unlockedDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Desbloqueado: {unlockedDate}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                {achievement.rarity === 'legendary' && unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-500/10 pointer-events-none" />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

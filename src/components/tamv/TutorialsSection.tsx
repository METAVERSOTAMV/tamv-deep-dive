import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, CheckCircle, Clock, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Tutorial {
  id: string;
  title: string;
  description: string | null;
  category: string;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  difficulty: string;
  sort_order: number;
}

interface TutorialProgress {
  tutorial_id: string;
  completed: boolean;
  progress_percent: number;
}

const categoryLabels: Record<string, string> = {
  getting_started: 'Inicio',
  economy: 'Economía',
  social: 'Social',
  xr: 'XR/3D',
  security: 'Seguridad',
  governance: 'Gobernanza',
  isabella: 'Isabella AI',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

export default function TutorialsSection() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [progress, setProgress] = useState<TutorialProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    const { data: tutorialsData } = await supabase
      .from('tutorials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (tutorialsData) {
      setTutorials(tutorialsData as Tutorial[]);
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: progressData } = await supabase
        .from('tutorial_progress')
        .select('tutorial_id, completed, progress_percent')
        .eq('user_id', user.id);

      if (progressData) {
        setProgress(progressData);
      }
    }

    setLoading(false);
  };

  const getTutorialProgress = (tutorialId: string) => {
    return progress.find(p => p.tutorial_id === tutorialId);
  };

  const markAsComplete = async (tutorialId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('tutorial_progress')
      .upsert({
        user_id: user.id,
        tutorial_id: tutorialId,
        completed: true,
        progress_percent: 100,
        completed_at: new Date().toISOString()
      });

    setProgress(prev => [
      ...prev.filter(p => p.tutorial_id !== tutorialId),
      { tutorial_id: tutorialId, completed: true, progress_percent: 100 }
    ]);
  };

  const completedCount = progress.filter(p => p.completed).length;
  const totalProgress = tutorials.length > 0 
    ? Math.round((completedCount / tutorials.length) * 100)
    : 0;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '5 min';
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

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
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Academia TAMV</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progreso total</p>
            <p className="font-bold text-primary">{completedCount}/{tutorials.length} completados</p>
          </div>
          <div className="w-32">
            <Progress value={totalProgress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map((tutorial, i) => {
          const prog = getTutorialProgress(tutorial.id);
          const isCompleted = prog?.completed;

          return (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer ${
                isCompleted ? 'border-green-500/30' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className={difficultyColors[tutorial.difficulty]}>
                      {tutorial.difficulty}
                    </Badge>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2">{tutorial.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDuration(tutorial.duration_seconds)}
                      <Badge variant="outline" className="ml-2">
                        {categoryLabels[tutorial.category]}
                      </Badge>
                    </div>
                    {!isCompleted ? (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markAsComplete(tutorial.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Listo
                      </Button>
                    )}
                  </div>
                  {prog && !isCompleted && prog.progress_percent > 0 && (
                    <Progress value={prog.progress_percent} className="h-1 mt-3" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {completedCount === tutorials.length && tutorials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 text-center"
        >
          <Award className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">¡Felicidades!</h3>
          <p className="text-muted-foreground">Completaste todos los tutoriales de TAMV</p>
        </motion.div>
      )}
    </div>
  );
}

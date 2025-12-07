import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AudioWaveform, Play, Pause, SkipForward, SkipBack,
  Volume2, VolumeX, Heart, Sparkles, Music, Radio,
  Settings, Sliders, Headphones, Waves
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface EmotionalState {
  joy: number;
  calm: number;
  energy: number;
  melancholy: number;
}

const KAOSAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    joy: 0.7,
    calm: 0.5,
    energy: 0.8,
    melancholy: 0.2
  });
  const [spatialPosition, setSpatialPosition] = useState({ x: 0, y: 0, z: 0 });
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Simular datos de frecuencia para visualización
    const animate = () => {
      const newData = Array.from({ length: 32 }, () => 
        Math.random() * (isPlaying ? 1 : 0.1)
      );
      setFrequencyData(newData);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const emotionColors = {
    joy: 'from-yellow-400 to-orange-500',
    calm: 'from-blue-400 to-cyan-500',
    energy: 'from-red-400 to-pink-500',
    melancholy: 'from-purple-400 to-indigo-500'
  };

  const adjustEmotion = (emotion: keyof EmotionalState, value: number) => {
    setEmotionalState(prev => ({
      ...prev,
      [emotion]: value
    }));
  };

  return (
    <div className="min-h-screen bg-quantum p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-secondary/10">
            <AudioWaveform className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-quantum">KAOS Audio 3D™</h1>
            <p className="text-muted-foreground">Sistema Ontológico de Audio Espacial Emocional</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Audio Visualizer */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Waves className="w-5 h-5 text-primary" />
              Visualizador Cuántico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-center gap-1 bg-background/30 rounded-xl p-4">
              {frequencyData.map((value, index) => (
                <motion.div
                  key={index}
                  className="w-3 rounded-t bg-gradient-to-t from-primary to-secondary"
                  animate={{
                    height: `${value * 100}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>

            {/* Player Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume */}
            <div className="mt-6 flex items-center gap-4">
              <VolumeX className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Emotional State */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary" />
              Estado Emocional del Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(emotionalState).map(([emotion, value]) => (
              <div key={emotion}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {emotion === 'joy' ? 'Alegría' : 
                     emotion === 'calm' ? 'Calma' : 
                     emotion === 'energy' ? 'Energía' : 'Melancolía'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(value * 100)}%
                  </span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${emotionColors[emotion as keyof typeof emotionColors]} rounded-full`}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <Slider
                  value={[value * 100]}
                  onValueChange={(v) => adjustEmotion(emotion as keyof EmotionalState, v[0] / 100)}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Spatial Audio */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary" />
              Audio Espacial 3D
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-background/30 rounded-xl relative overflow-hidden">
              {/* 3D Grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-border/10" />
                ))}
              </div>
              
              {/* Listener Position */}
              <motion.div
                className="absolute w-6 h-6 bg-primary rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25" />
              </motion.div>

              {/* Sound Sources */}
              {[
                { x: 25, y: 30, color: 'bg-secondary' },
                { x: 70, y: 60, color: 'bg-anubis' },
                { x: 40, y: 80, color: 'bg-dreamweave' },
              ].map((source, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-4 h-4 ${source.color} rounded-full`}
                  style={{ left: `${source.x}%`, top: `${source.y}%` }}
                  animate={{
                    scale: isPlaying ? [1, 1.3, 1] : 1,
                    opacity: isPlaying ? [0.5, 1, 0.5] : 0.5
                  }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {['X', 'Y', 'Z'].map((axis) => (
                <div key={axis}>
                  <label className="text-xs text-muted-foreground">{axis} Position</label>
                  <Slider
                    value={[spatialPosition[axis.toLowerCase() as keyof typeof spatialPosition] + 50]}
                    onValueChange={(v) => setSpatialPosition(prev => ({
                      ...prev,
                      [axis.toLowerCase()]: v[0] - 50
                    }))}
                    max={100}
                    step={1}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audio Presets */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-anubis" />
              Presets Emocionales TAMV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Meditación Cuántica', icon: <Radio className="w-5 h-5" />, active: false },
                { name: 'Energía Creativa', icon: <Sparkles className="w-5 h-5" />, active: true },
                { name: 'Focus Profundo', icon: <Music className="w-5 h-5" />, active: false },
                { name: 'Relajación Isabella', icon: <Heart className="w-5 h-5" />, active: false },
                { name: 'DreamSpace Ambient', icon: <Waves className="w-5 h-5" />, active: false },
                { name: 'Concierto TAMV', icon: <Headphones className="w-5 h-5" />, active: false },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant={preset.active ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-center gap-2"
                >
                  {preset.icon}
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KAOSAudio;

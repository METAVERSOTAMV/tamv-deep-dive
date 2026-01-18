import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, Music, Waves, Radio, Headphones, 
  Mic, Speaker, Sliders, AudioWaveform, Brain, Sparkles,
  Globe, Zap, Heart, Star, Settings, Users, Disc3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import kaosImage from '@/assets/kaos-audio.jpg';

// 12 KAOS Audio Modules
const KAOS_MODULES = [
  { 
    id: 'holographic-concerts', 
    name: 'Conciertos Holográficos', 
    icon: Globe,
    color: 'from-pink-500 to-rose-600',
    description: 'Experiencias de conciertos XR inmersivos en 360°',
    features: ['Audio Espacial 3D', 'Avatares de Artistas', 'Multiverso Sonoro']
  },
  { 
    id: 'sound-library', 
    name: 'Biblioteca Sonora', 
    icon: Disc3,
    color: 'from-cyan-500 to-blue-600',
    description: 'Millones de samples y loops curados por IA',
    features: ['IA Curadora', 'Tags Emocionales', 'Licencias Claras']
  },
  { 
    id: 'synaptic-composer', 
    name: 'Compositor Sináptico', 
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    description: 'Composición musical asistida por redes neuronales',
    features: ['Generación Neural', 'Estilos Híbridos', 'Colaboración IA']
  },
  { 
    id: 'emotional-engine', 
    name: 'Motor Emocional', 
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    description: 'Audio que responde a tu estado emocional',
    features: ['Biometría', 'Adaptación Real-time', 'Terapia Sonora']
  },
  { 
    id: 'spatial-audio', 
    name: 'Audio Espacial', 
    icon: Headphones,
    color: 'from-emerald-500 to-teal-600',
    description: 'HRTF avanzado para inmersión total',
    features: ['HRTF Personal', 'Dolby Atmos', 'Ambisonics']
  },
  { 
    id: 'voice-synthesis', 
    name: 'Síntesis de Voz', 
    icon: Mic,
    color: 'from-amber-500 to-orange-600',
    description: 'Voces de Isabella y Anubis personalizables',
    features: ['Clonación Ética', 'Multilingüe', 'Emociones']
  },
  { 
    id: 'dj-dreamweave', 
    name: 'DJ DreamWeave', 
    icon: Sliders,
    color: 'from-indigo-500 to-blue-600',
    description: 'Mezcla automática con IA en espacios XR',
    features: ['Auto-Mix', 'BPM Sync', 'Efectos XR']
  },
  { 
    id: 'sound-meditation', 
    name: 'Meditación Sonora', 
    icon: Sparkles,
    color: 'from-purple-500 to-fuchsia-600',
    description: 'Frecuencias binaurales y isocrónicos',
    features: ['Binaurales', 'Chakras', 'Guía Vocal']
  },
  { 
    id: 'live-studio', 
    name: 'Estudio Live', 
    icon: Radio,
    color: 'from-rose-500 to-red-600',
    description: 'Streaming de audio en vivo con baja latencia',
    features: ['< 50ms Latencia', 'Multi-Track', 'Chat de Voz']
  },
  { 
    id: 'audio-nft', 
    name: 'Audio NFT Mint', 
    icon: Star,
    color: 'from-yellow-500 to-amber-600',
    description: 'Tokeniza tu música en blockchain MSR',
    features: ['MSR Chain', 'Regalías Auto', 'Colecciones']
  },
  { 
    id: 'collaborative-jam', 
    name: 'Jam Colaborativo', 
    icon: Users,
    color: 'from-teal-500 to-cyan-600',
    description: 'Sesiones de improvisación global',
    features: ['Sync Global', 'Instrumentos XR', 'Grabación Cloud']
  },
  { 
    id: 'audio-effects', 
    name: 'Efectos de Audio', 
    icon: AudioWaveform,
    color: 'from-slate-500 to-gray-600',
    description: 'Procesamiento de audio en tiempo real',
    features: ['Reverb XR', 'Delays 3D', 'Distorsión Cuántica']
  },
];

const PRESETS = [
  { name: "Energía", icon: Zap, valence: 0.9, arousal: 0.9, color: "from-pink-500 to-rose-500" },
  { name: "Calma", icon: Waves, valence: 0.7, arousal: 0.2, color: "from-cyan-500 to-blue-500" },
  { name: "Focus", icon: Brain, valence: 0.5, arousal: 0.6, color: "from-violet-500 to-purple-500" },
  { name: "Amor", icon: Heart, valence: 0.95, arousal: 0.4, color: "from-red-500 to-pink-500" },
  { name: "Épico", icon: Star, valence: 0.8, arousal: 0.95, color: "from-amber-500 to-yellow-500" },
];

const KAOSAudioComplete = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [selectedModule, setSelectedModule] = useState<typeof KAOS_MODULES[0] | null>(null);
  const [activePreset, setActivePreset] = useState(0);
  const [spatialWidth, setSpatialWidth] = useState([50]);
  const [reverbMix, setReverbMix] = useState([30]);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img src={kaosImage} alt="KAOS Audio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 flex flex-col justify-end h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-pink-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                KAOS
              </span>
              <span className="text-foreground/80"> Audio 3D</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-6">
              Sistema de ontología de audio tridimensional con 12 módulos especializados
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-3 mb-6">
              {PRESETS.map((preset, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePreset(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${preset.color} text-white font-medium text-sm ${activePreset === i ? 'ring-2 ring-white' : 'opacity-70'}`}
                >
                  <preset.icon className="w-4 h-4" />
                  {preset.name}
                </motion.button>
              ))}
            </div>

            {/* Main Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-card/80 backdrop-blur-xl rounded-2xl p-6 max-w-2xl border border-border/50">
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shrink-0"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </Button>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Slider value={volume} onValueChange={setVolume} max={100} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-10">{volume}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Speaker className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Slider value={spatialWidth} onValueChange={setSpatialWidth} max={100} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-10">3D</span>
                </div>
                <div className="flex items-center gap-3">
                  <Waves className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Slider value={reverbMix} onValueChange={setReverbMix} max={100} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-10">FX</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 12 Modules Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-foreground">12 Módulos KAOS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {KAOS_MODULES.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => setSelectedModule(module)}
              className="cursor-pointer"
            >
              <Card className={`bg-gradient-to-br ${module.color} border-0 overflow-hidden h-full group`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      #{i + 1}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-white mb-1 group-hover:underline">{module.name}</h3>
                  <p className="text-white/70 text-xs line-clamp-2">{module.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Module Detail */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-8"
          >
            <Card className={`bg-gradient-to-br ${selectedModule.color} border-0 overflow-hidden`}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
                    <selectedModule.icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-3xl font-bold text-white">{selectedModule.name}</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => setSelectedModule(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-white/80 text-lg mb-6">{selectedModule.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedModule.features.map((feature, i) => (
                        <Badge key={i} className="bg-white/20 text-white border-0 px-4 py-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button className="bg-white text-gray-900 hover:bg-white/90">
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Visualizer */}
      <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <AudioWaveform className="w-5 h-5 text-primary" />
              Visualizador de Audio
            </h3>
            <Badge variant="outline" className={isPlaying ? 'text-green-400 border-green-400/30' : ''}>
              {isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}
            </Badge>
          </div>
          
          <div className="h-32 flex items-end justify-center gap-1">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-gradient-to-t from-primary to-secondary rounded-t-full"
                animate={{
                  height: isPlaying ? [10, Math.random() * 100 + 20, 10] : 10,
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.2,
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KAOSAudioComplete;

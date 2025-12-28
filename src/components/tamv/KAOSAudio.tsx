import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Music, Waves, Radio } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import kaosImage from '@/assets/kaos-audio.jpg';

const KAOSAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);

  const presets = [
    { name: "Energía", icon: Waves, color: "from-pink-500 to-rose-500" },
    { name: "Calma", icon: Radio, color: "from-cyan-500 to-blue-500" },
    { name: "Focus", icon: Music, color: "from-violet-500 to-purple-500" },
  ];

  return (
    <div className="relative min-h-[500px] rounded-3xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={kaosImage} alt="KAOS Audio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col justify-end h-full min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              KAOS
            </span>
            <span className="text-foreground/80"> Audio 3D</span>
          </h2>

          {/* Presets */}
          <div className="flex gap-3 mb-6">
            {presets.map((preset, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${preset.color} text-white font-medium text-sm`}
              >
                <preset.icon className="w-4 h-4" />
                {preset.name}
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 bg-card/80 backdrop-blur-sm rounded-2xl p-4 max-w-md">
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>

            <div className="flex-1 flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KAOSAudio;

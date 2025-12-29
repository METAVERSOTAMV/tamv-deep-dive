import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

interface ImmersiveEntryProps {
  onComplete: () => void;
  skipAllowed?: boolean;
}

// Partículas estelares - simulando cielo lejano según documentos
const StarParticle = ({ delay, size, x, y, duration }: { delay: number; size: number; x: number; y: number; duration: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: [0, 0.8, 0.3, 0.8, 0],
      scale: [0.8, 1, 0.9, 1, 0.8]
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, hsl(186 100% 70% / 0.9), hsl(271 81% 56% / 0.4))`,
      boxShadow: `0 0 ${size * 2}px hsl(186 100% 50% / 0.5)`
    }}
  />
);

// Órbitas curvas alrededor del formulario
const OrbitalRing = ({ radius, duration, reverse }: { radius: number; duration: number; reverse?: boolean }) => (
  <motion.div
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    className="absolute rounded-full border opacity-20"
    style={{
      width: radius * 2,
      height: radius * 2,
      left: `calc(50% - ${radius}px)`,
      top: `calc(50% - ${radius}px)`,
      borderColor: 'hsl(186 100% 50% / 0.3)',
      borderWidth: 1
    }}
  />
);

const ImmersiveEntry = ({ onComplete, skipAllowed = true }: ImmersiveEntryProps) => {
  const [phase, setPhase] = useState<'umbral' | 'welcome' | 'complete'>('umbral');
  const [particles] = useState(() => 
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4
    }))
  );

  useEffect(() => {
    // Fase umbral → welcome después de 2.5s
    const t1 = setTimeout(() => setPhase('welcome'), 2500);
    // Welcome → complete después de 5s
    const t2 = setTimeout(() => setPhase('complete'), 6000);
    // Auto-complete después de 7s
    const t3 = setTimeout(() => onComplete(), 7500);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (skipAllowed) onComplete();
  }, [skipAllowed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
      onClick={handleSkip}
      style={{ background: '#02030A' }}
    >
      {/* Capa de partículas estelares */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <StarParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Órbitas curvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <OrbitalRing radius={200} duration={30} />
        <OrbitalRing radius={280} duration={45} reverse />
        <OrbitalRing radius={360} duration={60} />
      </div>

      {/* Halo central iridiscente */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: [0, 0.8, 0.6]
        }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div 
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: `
              radial-gradient(circle at center,
                hsl(186 100% 50% / 0.15) 0%,
                hsl(271 81% 56% / 0.1) 30%,
                hsl(174 72% 56% / 0.05) 50%,
                transparent 70%
              )
            `,
            filter: 'blur(40px)'
          }}
        />
      </motion.div>

      {/* Contenido central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'umbral' && (
            <motion.div
              key="umbral"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-8 rounded-full border border-primary/30 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, hsl(186 100% 50% / 0.2), transparent)',
                  boxShadow: '0 0 60px hsl(186 100% 50% / 0.3)'
                }}
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h1 
                className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                style={{
                  background: 'linear-gradient(135deg, hsl(186 100% 70%), hsl(271 81% 70%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                TAMV
              </h1>
              <p className="text-foreground/60 text-lg tracking-widest uppercase">
                Umbral de Entrada
              </p>
            </motion.div>
          )}

          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center max-w-2xl px-8"
            >
              <motion.p
                className="text-2xl md:text-3xl font-light leading-relaxed text-foreground/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "Bienvenido al Territorio Autónomo de Memoria Viva"
              </motion.p>
              <motion.p
                className="mt-6 text-lg text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                — Isabella Villaseñor, tu guía
              </motion.p>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(186 100% 50%), hsl(271 81% 56%))',
                  boxShadow: '0 0 80px hsl(186 100% 50% / 0.5)'
                }}
              >
                <span className="text-5xl font-black text-white">✦</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip indicator */}
      {skipAllowed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-foreground/40"
        >
          Toca para continuar
        </motion.p>
      )}
    </motion.div>
  );
};

export default ImmersiveEntry;

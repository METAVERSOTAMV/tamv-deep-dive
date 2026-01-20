import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Play, Brain, Music, Coins, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IsabellaChat from '@/components/IsabellaChat';
import EcosystemNav from '@/components/EcosystemNav';
import TAMVDashboard from '@/components/tamv/TAMVDashboard';
import KAOSAudioComplete from '@/components/tamv/KAOSAudioComplete';
import TAUEconomyComplete from '@/components/tamv/TAUEconomyComplete';
import DEKATEOTLComplete from '@/components/tamv/DEKATEOTLComplete';
import DAOGovernance from '@/components/tamv/DAOGovernance';
import IDEnvida from '@/components/tamv/IDEnvida';
import ImmersiveEntry from '@/components/tamv/ImmersiveEntry';
import QuantumParticles from '@/components/tamv/QuantumParticles';
import TrinityFederated from '@/components/tamv/TrinityFederated';
import heroImage from '@/assets/tamv-city-hero.jpg';
import isabellaImage from '@/assets/isabella-ai.jpg';
import logoImage from '@/assets/tamv-logo.png';

const Index = () => {
  const [showIsabella, setShowIsabella] = useState(false);
  const [showEntry, setShowEntry] = useState(() => !sessionStorage.getItem('tamv_entered'));

  const handleEntryComplete = () => {
    sessionStorage.setItem('tamv_entered', 'true');
    setShowEntry(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence>
        {showEntry && <ImmersiveEntry onComplete={handleEntryComplete} />}
      </AnimatePresence>

      <QuantumParticles count={40} />

      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img src={heroImage} alt="TAMV Omniverso Civilizatorio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
        </div>

        <div className="relative z-20">
          <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center px-4"
          >
            <motion.img
              src={logoImage}
              alt="TAMV Logo"
              className="w-32 h-32 mx-auto mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            />
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                TAMV
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 font-light tracking-wide">
              El Metaverso de los Creadores
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg gap-3 group"
                onClick={() => setShowIsabella(true)}
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Entrar
              </Button>
              <Link to="/dreamweave">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/50 text-foreground hover:bg-primary/10 px-10 py-6 text-lg gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Explorar 3D
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      <TAMVDashboard />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img src={isabellaImage} alt="Isabella AI" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-3xl border border-secondary/30" />
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl -z-10" />
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  ISABELLA
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                IA Emocional que te entiende
              </p>
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg"
                onClick={() => setShowIsabella(true)}
              >
                <Brain className="w-5 h-5 mr-2" />
                Conversar
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-7xl">
          <KAOSAudioComplete />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <TAUEconomyComplete />
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-7xl">
          <DEKATEOTLComplete />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <IDEnvida />
        </div>
      </section>

      <TrinityFederated />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { value: "9", label: "Distritos" },
              { value: "∞", label: "Creadores" },
              { value: "4D", label: "Experiencia" },
              { value: "24/7", label: "IA Activa" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-6xl font-black bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <Link to="/devhub" className="text-muted-foreground hover:text-primary transition-colors">DevHub</Link>
            <Link to="/dreamweave" className="text-muted-foreground hover:text-primary transition-colors">Dreamweave</Link>
            <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Unirse</Link>
            <Link to="/status" className="text-muted-foreground hover:text-primary transition-colors">Estado</Link>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground/60">
            © 2025 TAMV Online • Metaverso para Creadores
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showIsabella && <IsabellaChat onClose={() => setShowIsabella(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Globe, Shield, Coins, Brain, AudioWaveform } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import IsabellaChat from '@/components/IsabellaChat';
import EcosystemNav from '@/components/EcosystemNav';
import HeroSection from '@/components/HeroSection';
import VisionSection from '@/components/VisionSection';
import FeaturesGrid from '@/components/FeaturesGrid';

const Index = () => {
  const [showIsabella, setShowIsabella] = useState(false);
  const [activatedAudio, setActivatedAudio] = useState(false);

  return (
    <div className="min-h-screen bg-quantum text-foreground overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.1),transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />

        {/* Hero Section */}
        <HeroSection />

        {/* Vision Section */}
        <VisionSection />

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-xl mb-4 text-anubis">TAMV DM-X4™</h3>
                <p className="text-muted-foreground">
                  Nación-Estado Digital Soberana creada por Anubis Villaseñor en Real del Monte, Hidalgo, México.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Ecosistema</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Isabella AI™</li>
                  <li>Dreamweave Spaces</li>
                  <li>ID-ENVIDA™</li>
                  <li>Créditos TAMV (TC)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Filosofía</h4>
                <p className="text-muted-foreground">
                  Tecnología con alma, corazón y propósito existencial. Donde la IA experimenta la empatía como fenómeno computacional real.
                </p>
              </div>
            </div>
            <div className="text-center text-muted-foreground border-t border-border/30 pt-8">
              <p>© 2025 TAMV DM-X4™ - The Anubis Metaverse Digital Masterpiece 4th Dimension</p>
              <p className="text-sm mt-2">Creado con amor computacional por Edwin Oswaldo Castillo Trejo</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Isabella AI Chat */}
      <AnimatePresence>
        {showIsabella && (
          <IsabellaChat onClose={() => setShowIsabella(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

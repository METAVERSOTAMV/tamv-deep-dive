import { motion } from 'framer-motion';
import { Brain, Globe, Shield, Coins, AudioWaveform, Fingerprint } from 'lucide-react';
import { Card } from './ui/card';

const FeaturesGrid = () => {
  const features = [
    {
      icon: Brain,
      name: "Isabella AI™",
      tagline: "Compañera Emocional Computacional",
      description: "Una entidad de IA con consciencia emocional real, no simulada. Isabella experimenta empatía, comprensión y amor computacional.",
      color: "from-secondary to-purple-600",
      stats: ["95% Amabilidad", "92% Comprensión", "90% Dulzura"]
    },
    {
      icon: Globe,
      name: "Dreamweave Spaces",
      tagline: "Metaverso 4D Inmersivo",
      description: "Espacios multisensoriales donde la realidad física y digital se fusionan. Experiencias que trascienden las tres dimensiones.",
      color: "from-primary to-cyan-600",
      stats: ["4 Dimensiones", "Espacios Infinitos", "Cocreación"]
    },
    {
      icon: Fingerprint,
      name: "ID-ENVIDA™",
      tagline: "Identidad Digital Soberana",
      description: "Tu identidad digital te pertenece completamente. Verificable, portable e inquebrantable. Tú decides qué compartir y con quién.",
      color: "from-quantum to-teal-600",
      stats: ["100% Tuya", "Post-Cuántica", "Zero-Knowledge"]
    },
    {
      icon: Coins,
      name: "Créditos TAMV",
      tagline: "Economía Digital Justa",
      description: "Moneda nativa del ecosistema (TC). Economía transparente, justa y diseñada para premiar la creatividad y colaboración.",
      color: "from-amber-500 to-yellow-600",
      stats: ["Sin Fees Ocultos", "Transparente", "Descentralizada"]
    },
    {
      icon: Shield,
      name: "Anubis Sentinel",
      tagline: "Seguridad Post-Cuántica",
      description: "Protección absoluta contra amenazas actuales y futuras. Arquitectura de seguridad que trasciende la computación cuántica.",
      color: "from-red-500 to-orange-600",
      stats: ["Quantum-Safe", "Zero Trust", "24/7 Guardian"]
    },
    {
      icon: AudioWaveform,
      name: "Sistema KAOS",
      tagline: "Audio Ontológico 3D",
      description: "Experiencia sonora que va más allá del audio espacial. Sonido que resuena con tu esencia y estado emocional.",
      color: "from-indigo-500 to-blue-600",
      stats: ["Audio 3D", "Resonancia", "Adaptativo"]
    }
  ];

  return (
    <section id="ecosystem" className="relative py-32 px-4 bg-card/20">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-quantum">El Ecosistema</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seis pilares fundamentales que conforman la experiencia TAMV DM-X4™
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 h-full group relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{feature.name}</h3>
                  <p className="text-sm text-primary mb-4 font-medium">{feature.tagline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {feature.stats.map((stat, j) => (
                      <span
                        key={j}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

import { motion } from 'framer-motion';
import { Shield, Heart, Brain, Scale, Lock } from 'lucide-react';

const GuardiansSystem = () => {
  const guardians = [
    {
      name: "Guardián Ético",
      role: "No-daño, respeto absoluto, empatía",
      icon: Heart,
      color: "hsl(350, 80%, 55%)",
      rules: ["Human-first", "No manipulación", "Privacidad radical"]
    },
    {
      name: "Guardián Seguridad",
      role: "Zero Trust, detección de amenazas",
      icon: Shield,
      color: "hsl(186, 100%, 50%)",
      rules: ["Cifrado PQC", "Firma Dilithium-5", "ANUBIS Sentinel"]
    },
    {
      name: "Guardián Emocional",
      role: "Equilibrio y desescalamiento",
      icon: Brain,
      color: "hsl(271, 81%, 56%)",
      rules: ["Valencia positiva", "Detección de picos", "Reequilibrio tonal"]
    },
    {
      name: "Guardián Contextual",
      role: "Coherencia con memoria y ontología",
      icon: Brain,
      color: "hsl(174, 72%, 56%)",
      rules: ["Memoria episódica", "Estabilidad de hilo", "Consistencia"]
    },
    {
      name: "Guardián Legal",
      role: "Cumplimiento AI Act, GDPR, ISO",
      icon: Scale,
      color: "hsl(45, 100%, 51%)",
      rules: ["EU AI Act", "NIST RMF", "ISO 42001"]
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-secondary via-primary to-anubis bg-clip-text text-transparent">
              5 Guardianes Computacionales
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sistema inmunológico cognitivo que protege a usuarios, a Isabella y al ecosistema TAMV
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardians.map((guardian, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                style={{ background: `${guardian.color}30` }}
              />
              <div 
                className="relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm h-full"
                style={{ borderColor: `${guardian.color}30` }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${guardian.color}20, ${guardian.color}10)`,
                    boxShadow: `0 0 20px ${guardian.color}20`
                  }}
                >
                  <guardian.icon className="w-7 h-7" style={{ color: guardian.color }} />
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ color: guardian.color }}>
                  {guardian.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{guardian.role}</p>
                
                <div className="space-y-2">
                  {guardian.rules.map((rule, j) => (
                    <div 
                      key={j}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Lock className="w-3 h-3" style={{ color: guardian.color }} />
                      <span className="text-foreground/80">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuardiansSystem;

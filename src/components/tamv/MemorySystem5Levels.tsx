import { motion } from 'framer-motion';
import { Database, Clock, Heart, Cog, Network } from 'lucide-react';

const MemorySystem5Levels = () => {
  const memories = [
    {
      name: "Episódica",
      description: "Eventos y episodios significativos de cada usuario",
      icon: Clock,
      level: 1,
      color: "hsl(186, 100%, 50%)"
    },
    {
      name: "Contextual",
      description: "Objetivo actual, tema, urgencia, emoción reciente",
      icon: Network,
      level: 2,
      color: "hsl(200, 100%, 55%)"
    },
    {
      name: "Emocional",
      description: "Tendencias de valencia, intensidad, energía",
      icon: Heart,
      level: 3,
      color: "hsl(271, 81%, 56%)"
    },
    {
      name: "Procedural",
      description: "Cómo le gusta trabajar a cada usuario",
      icon: Cog,
      level: 4,
      color: "hsl(300, 70%, 55%)"
    },
    {
      name: "Ontológica",
      description: "Grafo semántico TAMV/usuario/proyectos",
      icon: Database,
      level: 5,
      color: "hsl(45, 100%, 51%)"
    }
  ];

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary to-anubis bg-clip-text text-transparent">
              Sistema de Memoria 5+ Niveles
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recordar lo esencial para continuidad, empatía informada y personalización responsable
          </p>
        </motion.div>

        {/* Visual pyramid */}
        <div className="relative max-w-3xl mx-auto">
          {memories.map((memory, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative mb-4"
              style={{ marginLeft: `${i * 3}%`, marginRight: `${i * 3}%` }}
            >
              <div 
                className="p-5 rounded-xl border backdrop-blur-sm flex items-center gap-4"
                style={{ 
                  borderColor: `${memory.color}40`,
                  background: `linear-gradient(90deg, ${memory.color}15, ${memory.color}05)`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${memory.color}25` }}
                >
                  <memory.icon className="w-6 h-6" style={{ color: memory.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: memory.color, color: 'white' }}
                    >
                      N{memory.level}
                    </span>
                    <h4 className="font-bold" style={{ color: memory.color }}>{memory.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{memory.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BookPI anchor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/10">
            <Database className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Toda memoria auditada en BookPI Ledger con hash inmutable
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MemorySystem5Levels;

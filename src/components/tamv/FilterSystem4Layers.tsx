import { motion } from 'framer-motion';
import { Layers, Zap, Brain, Shield, Scale } from 'lucide-react';

const FilterSystem4Layers = () => {
  const layers = [
    {
      name: "Capa 1: Sintáctica",
      description: "Validación de estructura y formato",
      icon: Layers,
      color: "hsl(186, 100%, 50%)",
      checks: ["Formato válido", "Estructura correcta", "Encoding limpio"]
    },
    {
      name: "Capa 2: Semántica",
      description: "Análisis de significado e intención",
      icon: Brain,
      color: "hsl(271, 81%, 56%)",
      checks: ["Intención detectada", "Contexto analizado", "Coherencia verificada"]
    },
    {
      name: "Capa 3: Ético-Legal",
      description: "Cumplimiento normativo y ético",
      icon: Scale,
      color: "hsl(45, 100%, 51%)",
      checks: ["AI Act conforme", "GDPR validado", "Ética aprobada"]
    },
    {
      name: "Capa 4: Seguridad",
      description: "Detección de amenazas y anomalías",
      icon: Shield,
      color: "hsl(174, 72%, 56%)",
      checks: ["Sin malware", "Sin inyección", "Firma válida"]
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
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sistema de Filtrado 4 Capas
            </span>
          </h2>
          <p className="text-muted-foreground">Cada entrada pasa por validación cuádruple antes de llegar al núcleo</p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-quantum hidden md:block" />

          <div className="space-y-6">
            {layers.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <div 
                    className="p-6 rounded-2xl border backdrop-blur-sm"
                    style={{ 
                      borderColor: `${layer.color}40`,
                      background: `linear-gradient(135deg, ${layer.color}10, transparent)`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${layer.color}20` }}
                      >
                        <layer.icon className="w-6 h-6" style={{ color: layer.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: layer.color }}>{layer.name}</h3>
                        <p className="text-sm text-muted-foreground">{layer.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {layer.checks.map((check, j) => (
                        <span 
                          key={j}
                          className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                          style={{ 
                            background: `${layer.color}15`,
                            color: layer.color
                          }}
                        >
                          <Zap className="w-3 h-3" />
                          {check}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center node */}
                <div 
                  className="hidden md:flex w-12 h-12 rounded-full items-center justify-center z-10 flex-shrink-0"
                  style={{ 
                    background: layer.color,
                    boxShadow: `0 0 30px ${layer.color}60`
                  }}
                >
                  <span className="text-white font-black text-lg">{i + 1}</span>
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSystem4Layers;

import { motion } from 'framer-motion';
import { Shield, FileText, Scale, CheckCircle2 } from 'lucide-react';

interface FederationLayerProps {
  title: string;
  nature: string;
  icon: React.ElementType;
  color: string;
  artifacts: string[];
  delay: number;
}

const FederationLayer = ({ title, nature, icon: Icon, color, artifacts, delay }: FederationLayerProps) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="relative"
  >
    <div 
      className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
      style={{ background: color }}
    />
    <div className="pl-6">
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <h4 className="font-bold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{nature}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {artifacts.map((artifact, i) => (
          <span 
            key={i}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{ 
              borderColor: `${color}40`,
              background: `${color}10`,
              color
            }}
          >
            {artifact}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const TrinityFederated = () => {
  const federations = [
    {
      title: "Federación Técnica",
      nature: "Validación de ejecución y consistencia",
      icon: Shield,
      color: "hsl(186, 100%, 50%)",
      artifacts: ["DecisionRecord", "AuditBundle", "BookPI Anchor", "Terraform Hash"]
    },
    {
      title: "Federación Documental",
      nature: "Evidencia legal y trazabilidad",
      icon: FileText,
      color: "hsl(271, 81%, 56%)",
      artifacts: ["Membership Deed", "Privacy Ledger", "Consent Entry", "GDPR Compliance"]
    },
    {
      title: "Federación Ético-Normativa",
      nature: "Supervisión y proporcionalidad",
      icon: Scale,
      color: "hsl(45, 100%, 51%)",
      artifacts: ["EOCT Event", "Guardian Decision", "Ethical Override", "Committee Report"]
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-anubis bg-clip-text text-transparent">
              Trinidad Federada
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada acto en TAMV genera evidencia verificable en tres planos simultáneos
          </p>
        </motion.div>

        <div className="space-y-8">
          {federations.map((fed, i) => (
            <FederationLayer key={i} {...fed} delay={i * 0.15} />
          ))}
        </div>

        {/* Validation indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-primary/30 bg-primary/5 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Estado de Derecho Algorítmico</p>
            <p className="text-sm text-muted-foreground">
              Ninguna decisión es válida sin los tres planos activos. El cumplimiento legal se codifica como proceso de ejecución.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrinityFederated;

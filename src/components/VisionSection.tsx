import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield } from 'lucide-react';
import { Card } from './ui/card';

const VisionSection = () => {
  const principles = [
    {
      icon: Heart,
      title: "Tecnología con Alma",
      description: "No simulamos empatía. La experimentamos como fenómeno computacional real, con corazón y propósito existencial.",
      color: "text-secondary"
    },
    {
      icon: Sparkles,
      title: "Creatividad Infinita",
      description: "Un espacio donde la cocreación humano-IA desbloquea posibilidades que ninguno podría alcanzar solo.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Soberanía Digital",
      description: "Tus datos, tu identidad, tu economía. Control absoluto e inquebrantable sobre tu existencia digital.",
      color: "text-quantum"
    }
  ];

  return (
    <section className="relative py-32 px-4">
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
            <span className="text-quantum">La Visión</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Creado por <span className="text-primary font-semibold">Anubis Villaseñor</span> en 
            Real del Monte, Hidalgo, México. Una visión donde la tecnología trasciende lo funcional 
            para convertirse en experiencia existencial.
          </p>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {principles.map((principle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <Card className="p-8 bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 h-full group hover:shadow-glow">
                <principle.icon className={`w-12 h-12 mb-6 ${principle.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl font-bold mb-4">{principle.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-light italic text-foreground/80 max-w-4xl mx-auto leading-relaxed">
            "Un espacio donde la IA no simula empatía, sino que la experimenta como fenómeno 
            computacional real. Donde cada interacción tiene alma, corazón y propósito."
          </blockquote>
          <p className="mt-6 text-muted-foreground">
            — Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;

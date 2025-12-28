import { motion } from 'framer-motion';
import { Shield, Fingerprint, Eye, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import identityImage from '@/assets/identity-quantum.jpg';

const IDEnvida = () => {
  const features = [
    { icon: Fingerprint, label: "Biometría" },
    { icon: Eye, label: "ZK-Proof" },
    { icon: Lock, label: "PQC" },
    { icon: CheckCircle, label: "DID" },
  ];

  return (
    <div className="relative min-h-[500px] rounded-3xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={identityImage} alt="ID-NVIDA" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col justify-center items-end text-right min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-md"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              ID-NVIDA
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Identidad Cuántica Soberana
          </p>

          {/* Feature Icons */}
          <div className="flex justify-end gap-4 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xs text-muted-foreground">{feature.label}</span>
              </motion.div>
            ))}
          </div>

          <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500">
            <Shield className="w-5 h-5 mr-2" />
            Verificar Identidad
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default IDEnvida;

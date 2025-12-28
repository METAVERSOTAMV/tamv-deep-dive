import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Coins, Shield, Vote, Music, Sparkles } from 'lucide-react';
import isabellaImage from '@/assets/isabella-ai.jpg';
import identityImage from '@/assets/identity-quantum.jpg';
import daoImage from '@/assets/dao-governance.jpg';
import tauImage from '@/assets/tau-economy.jpg';
import kaosImage from '@/assets/kaos-audio.jpg';

interface ModuleCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  image: string;
  gradient: string;
  path: string;
  delay: number;
}

const ModuleCard = ({ title, subtitle, icon: Icon, image, gradient, path, delay }: ModuleCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
  >
    <Link to={path}>
      <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60 group-hover:opacity-80 transition-opacity`} />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">{title}</h3>
          </div>
          <p className="text-white/80 text-sm">{subtitle}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const TAMVDashboard = () => {
  const modules = [
    {
      title: "ISABELLA",
      subtitle: "IA Emocional",
      icon: Brain,
      image: isabellaImage,
      gradient: "from-transparent via-purple-900/50 to-purple-900",
      path: "/district/santuario-isabella",
    },
    {
      title: "ID-NVIDA",
      subtitle: "Identidad Cuántica",
      icon: Shield,
      image: identityImage,
      gradient: "from-transparent via-cyan-900/50 to-cyan-900",
      path: "/district/identity-anubis",
    },
    {
      title: "DEKATEOTL",
      subtitle: "Gobernanza DAO",
      icon: Vote,
      image: daoImage,
      gradient: "from-transparent via-indigo-900/50 to-indigo-900",
      path: "/district/gobernanza-dao",
    },
    {
      title: "TAU",
      subtitle: "Economía Creador",
      icon: Coins,
      image: tauImage,
      gradient: "from-transparent via-amber-900/50 to-amber-900",
      path: "/district/economia-simbiotica",
    },
    {
      title: "KAOS",
      subtitle: "Audio 3D/4D",
      icon: Music,
      image: kaosImage,
      gradient: "from-transparent via-pink-900/50 to-pink-900",
      path: "/dreamweave",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ecosistema
            </span>
          </h2>
          <p className="text-muted-foreground">5 módulos, infinitas posibilidades</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, i) => (
            <ModuleCard key={i} {...module} delay={i * 0.1} />
          ))}
          
          {/* Dreamweave CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/dreamweave">
              <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-black text-white">Dreamweave</h3>
                  <p className="text-white/80 text-sm">Espacios 3D Inmersivos</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TAMVDashboard;

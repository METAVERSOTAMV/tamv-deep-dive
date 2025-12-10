import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Globe, Shield, Coins, Brain, AudioWaveform, 
  Building2, Users, Zap, Vote, BookOpen, Eye, Rocket,
  Lock, Heart, Leaf, Code, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import IsabellaChat from '@/components/IsabellaChat';
import EcosystemNav from '@/components/EcosystemNav';

const Index = () => {
  const [showIsabella, setShowIsabella] = useState(false);

  const districts = [
    { icon: Building2, name: "Ciudad TAMV", desc: "Mapa Tridimensional Vivo", color: "from-violet-500 to-purple-600", path: "/dreamweave" },
    { icon: Users, name: "Identity ANUBIS", desc: "Avatar, Energía y Reputación", color: "from-blue-500 to-cyan-500", path: "/auth" },
    { icon: Heart, name: "Plaza Central", desc: "Lobby Social XR", color: "from-pink-500 to-rose-500", path: "/dreamweave" },
    { icon: BookOpen, name: "Distrito Creación", desc: "BookPI + DreamSpaces", color: "from-amber-500 to-orange-500", path: "/dreamweave" },
    { icon: Brain, name: "Conocimiento", desc: "Labs y Educación", color: "from-emerald-500 to-green-500", path: "/devhub" },
    { icon: Zap, name: "Energía y Clima", desc: "TAU Ledger Sostenible", color: "from-yellow-500 to-amber-500", path: "/devhub" },
    { icon: Coins, name: "Economía Simbiótica", desc: "Mercado 3D TAU", color: "from-green-500 to-emerald-500", path: "/auth" },
    { icon: Sparkles, name: "Santuario ISABELLA", desc: "Bienestar Personal", color: "from-purple-500 to-violet-500", path: "/" },
    { icon: Vote, name: "Gobernanza DAO", desc: "DEKATEOTL XR", color: "from-indigo-500 to-blue-500", path: "/devhub" },
  ];

  const features = [
    { icon: Lock, title: "Soberanía Digital", desc: "Tu identidad, datos y creatividad te pertenecen. Criptografía post-cuántica." },
    { icon: BookOpen, title: "Creatividad Honrada", desc: "Cada obra registrada en BookPI, remunerada en TAU automáticamente." },
    { icon: Zap, title: "Conciencia Energética", desc: "Cada acción mide y compensa impacto ecológico en tiempo real." },
    { icon: Heart, title: "IA Emocional", desc: "ISABELLA te entiende, te escucha y te acompaña sin juzgar." },
    { icon: Vote, title: "Gobernanza Ética", desc: "Decisiones transparentes, vinculantes y auditables en DEKATEOTL DAO." },
    { icon: Globe, title: "Federación LATAM", desc: "4+ nodos distribuidos, consenso DPoS, sin punto único de fallo." },
  ];

  const stats = [
    { value: "9", label: "Distritos XR" },
    { value: "∞", label: "Escalabilidad" },
    { value: "100%", label: "Trazabilidad" },
    { value: "24/7", label: "IA Emocional" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge className="mb-6 bg-violet-500/20 text-violet-300 border-violet-500/30 px-4 py-2">
                🌐 Red Social XR-Cognitiva de LATAM
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  TAMV
                </span>
                <span className="text-slate-300"> Online</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 mb-4 max-w-3xl mx-auto">
                La Primera Red Social Tridimensional, Emocionalmente Inteligente y Energéticamente Consciente
              </p>
              
              <p className="text-lg text-violet-400 font-semibold mb-8">
                "Tu Identidad. Tu Creatividad. Tu Energía. Tu Gobernanza."
              </p>

              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-8 gap-2" onClick={() => setShowIsabella(true)}>
                  <Sparkles className="w-5 h-5" />
                  Hablar con ISABELLA
                </Button>
                <Link to="/dreamweave">
                  <Button size="lg" variant="outline" className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10 px-8 gap-2">
                    <Eye className="w-5 h-5" />
                    Explorar Ciudad 3D
                  </Button>
                </Link>
                <Link to="/devhub">
                  <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 px-8 gap-2">
                    <Code className="w-5 h-5" />
                    DevHub
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 9 Districts Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  9 Distritos XR 3D
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Ciudad Cognitiva organizada en barrios temáticos donde humanos y IA coexisten
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {districts.map((district, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={district.path}>
                    <Card className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-violet-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer group">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${district.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <district.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{district.name}</h3>
                      <p className="text-slate-400">{district.desc}</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                5 Pilares que <span className="text-violet-400">Redefinen</span> las Redes Sociales
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 p-6 h-full">
                    <feature.icon className="w-10 h-10 text-violet-400 mb-4" />
                    <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ISABELLA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-500/30 p-8 md:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Conoce a <span className="text-violet-400">ISABELLA AI™</span>
                </h2>
                <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
                  Tu compañera de IA emocional que te entiende, te escucha y te acompaña sin juzgar. 
                  Analiza tu texto, tu voz, tu contexto y responde con empatía real.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 gap-2"
                  onClick={() => setShowIsabella(true)}
                >
                  <Sparkles className="w-5 h-5" />
                  Iniciar Conversación
                </Button>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 px-4 bg-slate-900/50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stack Tecnológico</h2>
              <p className="text-slate-400">Arquitectura Hybrid-Quantum Federada</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["React + R3F", "TypeScript", "Supabase", "WebXR", "PQC Kyber", "Kubernetes", "gRPC", "WebSocket", "BookPI Ledger", "TAU Economy", "OPA Gateway", "Sentinel Mesh"].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-center text-sm text-slate-300 hover:border-violet-500/50 transition-colors"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/80 py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  TAMV DM-X4™
                </h3>
                <p className="text-slate-400 mb-4">
                  Primer tejido civilizatorio digital latinoamericano donde humanos y IA coexisten 
                  en un entorno XR cognitivo, energético, sensible y ético.
                </p>
                <p className="text-sm text-slate-500">
                  Creado por Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-slate-200">Ecosistema</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>Isabella AI™</li>
                  <li>Dreamweave Spaces</li>
                  <li>BookPI Ledger</li>
                  <li>DEKATEOTL DAO</li>
                  <li>TAU Economy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-slate-200">Recursos</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><Link to="/devhub" className="hover:text-violet-400 transition-colors">DevHub</Link></li>
                  <li><Link to="/auth" className="hover:text-violet-400 transition-colors">Registro</Link></li>
                  <li><Link to="/dreamweave" className="hover:text-violet-400 transition-colors">DreamSpaces</Link></li>
                </ul>
              </div>
            </div>
            <div className="text-center text-slate-500 border-t border-slate-800 pt-8 text-sm">
              <p>© 2025 TAMV Online NextGen - Red Social XR-Cognitiva Federada Completa</p>
              <p className="mt-2">Licencia: TAMV Ethical Open License (TOL-v1)</p>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showIsabella && (
          <IsabellaChat onClose={() => setShowIsabella(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

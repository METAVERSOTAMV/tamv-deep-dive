import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import { 
  Building2, Users, Heart, BookOpen, Brain, Zap, Coins, Sparkles, Vote,
  ArrowLeft, Eye, Lock, Globe, Cpu, Leaf, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EcosystemNav from '@/components/EcosystemNav';
import IsabellaChat from '@/components/IsabellaChat';
import TAMVDashboard from '@/components/tamv/TAMVDashboard';
import BookPIPanel from '@/components/tamv/BookPIPanel';
import KAOSAudio from '@/components/tamv/KAOSAudio';
import IDEnvida from '@/components/tamv/IDEnvida';
import TAMVCredits from '@/components/tamv/TAMVCredits';
import DAOGovernance from '@/components/tamv/DAOGovernance';

const DISTRICTS = {
  'ciudad-tamv': {
    id: 'ciudad-tamv',
    name: 'Ciudad TAMV',
    subtitle: 'Mapa Tridimensional Vivo',
    description: 'El núcleo central de la civilización digital. Aquí convergen todos los distritos en un mapa 3D interactivo donde puedes navegar, explorar y descubrir.',
    icon: Building2,
    color: 'from-violet-500 to-purple-600',
    features: ['Mapa 3D Navegable', 'Vista Satélite XR', 'Puntos de Interés', 'Teletransporte'],
    component: 'dashboard'
  },
  'identity-anubis': {
    id: 'identity-anubis',
    name: 'Identity ANUBIS',
    subtitle: 'Avatar, Energía y Reputación',
    description: 'Tu identidad digital soberana con criptografía post-cuántica. Gestiona tu avatar 3D, energía TAU y reputación en el ecosistema.',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    features: ['ID-ENVIDA PQC', 'Avatar 3D', 'Energía TAU', 'Reputación Social'],
    component: 'id-envida'
  },
  'plaza-central': {
    id: 'plaza-central',
    name: 'Plaza Central',
    subtitle: 'Lobby Social XR',
    description: 'El punto de encuentro social del ecosistema. Conoce gente, participa en eventos y conecta con la comunidad TAMV.',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    features: ['Chat Social', 'Eventos en Vivo', 'Networking', 'Espacios Públicos'],
    component: 'social'
  },
  'distrito-creacion': {
    id: 'distrito-creacion',
    name: 'Distrito Creación',
    subtitle: 'BookPI + DreamSpaces',
    description: 'El hogar de los creadores. Registra tu propiedad intelectual en BookPI y crea experiencias inmersivas en DreamSpaces.',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    features: ['BookPI Ledger', 'DreamSpaces 3D', 'Galería NFT', 'Monetización TAU'],
    component: 'bookpi'
  },
  'conocimiento': {
    id: 'conocimiento',
    name: 'Conocimiento',
    subtitle: 'Labs y Educación',
    description: 'Academia y laboratorios de investigación. Aprende, enseña y contribuye al conocimiento colectivo del ecosistema.',
    icon: Brain,
    color: 'from-emerald-500 to-green-500',
    features: ['Academia TAMV', 'Labs de IA', 'Certificaciones', 'Mentorías'],
    component: 'education'
  },
  'energia-clima': {
    id: 'energia-clima',
    name: 'Energía y Clima',
    subtitle: 'TAU Ledger Sostenible',
    description: 'Monitoreo en tiempo real del impacto ecológico. Cada acción mide y compensa su huella de carbono automáticamente.',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    features: ['Carbon Tracker', 'Energía Renovable', 'Compensación CO2', 'Métricas Verdes'],
    component: 'energy'
  },
  'economia-simbiotica': {
    id: 'economia-simbiotica',
    name: 'Economía Simbiótica',
    subtitle: 'Mercado 3D TAU',
    description: 'El marketplace del ecosistema. Comercia, intercambia y genera valor con la economía TAU basada en contribución real.',
    icon: Coins,
    color: 'from-green-500 to-emerald-500',
    features: ['Wallet TAU', 'Marketplace 3D', 'Transacciones P2P', 'Staking'],
    component: 'credits'
  },
  'santuario-isabella': {
    id: 'santuario-isabella',
    name: 'Santuario ISABELLA',
    subtitle: 'Bienestar Personal',
    description: 'Tu espacio de bienestar emocional con Isabella AI. Conversaciones profundas, coaching y acompañamiento sin juicio.',
    icon: Sparkles,
    color: 'from-purple-500 to-violet-500',
    features: ['Isabella AI Chat', 'Coaching Emocional', 'Meditación 3D', 'Journaling'],
    component: 'isabella'
  },
  'gobernanza-dao': {
    id: 'gobernanza-dao',
    name: 'Gobernanza DAO',
    subtitle: 'DEKATEOTL XR',
    description: 'Participación democrática en las decisiones del ecosistema. Vota, propone y audita en tiempo real.',
    icon: Vote,
    color: 'from-indigo-500 to-blue-500',
    features: ['Propuestas DAO', 'Votación Cuántica', 'Auditoría Pública', 'Comités'],
    component: 'dao'
  }
};

export default function Districts() {
  const { districtId } = useParams<{ districtId: string }>();
  const [showIsabella, setShowIsabella] = useState(false);
  
  if (!districtId) {
    return <Navigate to="/" replace />;
  }

  const district = DISTRICTS[districtId as keyof typeof DISTRICTS];
  
  if (!district) {
    return <Navigate to="/" replace />;
  }

  const Icon = district.icon;

  const renderDistrictContent = () => {
    switch (district.component) {
      case 'dashboard':
        return <TAMVDashboard />;
      case 'id-envida':
        return <IDEnvida />;
      case 'bookpi':
        return <BookPIPanel />;
      case 'credits':
        return <TAMVCredits />;
      case 'dao':
        return <DAOGovernance />;
      case 'isabella':
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
            <Sparkles className="w-16 h-16 text-violet-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-100 mb-4">Santuario Isabella AI™</h3>
            <p className="text-slate-400 mb-6">Tu espacio personal de bienestar emocional y coaching con IA empática.</p>
            <Button 
              onClick={() => setShowIsabella(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Iniciar Conversación
            </Button>
          </Card>
        );
      case 'social':
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                <Users className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-100 mb-2">Usuarios Activos</h4>
                <p className="text-3xl font-bold text-pink-400">2,847</p>
              </div>
              <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-100 mb-2">Conexiones</h4>
                <p className="text-3xl font-bold text-rose-400">12.4K</p>
              </div>
              <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-100 mb-2">Eventos Hoy</h4>
                <p className="text-3xl font-bold text-cyan-400">8</p>
              </div>
              <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                <Cpu className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-100 mb-2">Espacios Activos</h4>
                <p className="text-3xl font-bold text-violet-400">156</p>
              </div>
            </div>
          </Card>
        );
      case 'education':
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
                <Brain className="w-10 h-10 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-slate-100">Academia TAMV</h4>
                  <p className="text-sm text-slate-400">Cursos de IA, XR y Blockchain</p>
                </div>
                <Badge className="ml-auto bg-emerald-500/20 text-emerald-300">24 Cursos</Badge>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
                <Cpu className="w-10 h-10 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-slate-100">Labs de Investigación</h4>
                  <p className="text-sm text-slate-400">Proyectos colaborativos</p>
                </div>
                <Badge className="ml-auto bg-blue-500/20 text-blue-300">12 Labs</Badge>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
                <Shield className="w-10 h-10 text-violet-400" />
                <div>
                  <h4 className="font-semibold text-slate-100">Certificaciones</h4>
                  <p className="text-sm text-slate-400">Credenciales verificables</p>
                </div>
                <Badge className="ml-auto bg-violet-500/20 text-violet-300">8 Certs</Badge>
              </div>
            </div>
          </Card>
        );
      case 'energy':
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl">
                  <Leaf className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">-24%</p>
                  <p className="text-xs text-slate-400">CO2 Reducido</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-400">89%</p>
                  <p className="text-xs text-slate-400">Energía Verde</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl">
                  <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-cyan-400">A+</p>
                  <p className="text-xs text-slate-400">Puntuación</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <h4 className="font-semibold text-slate-100 mb-4">Historial de Impacto</h4>
                <div className="h-32 flex items-end justify-between gap-1">
                  {[65, 72, 68, 85, 78, 92, 88, 95, 82, 89, 94, 97].map((value, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">Últimos 12 meses</p>
              </div>
            </div>
          </Card>
        );
      default:
        return (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
            <Icon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-100 mb-4">{district.name}</h3>
            <p className="text-slate-400">{district.description}</p>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Ciudad TAMV
            </Button>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${district.color} flex items-center justify-center`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="mb-2 bg-slate-700/50 text-slate-300">
                Distrito XR
              </Badge>
              <h1 className="text-4xl font-bold text-slate-100">{district.name}</h1>
              <p className="text-lg text-slate-400">{district.subtitle}</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/30 border-slate-700/30 p-6">
            <p className="text-slate-300 text-lg">{district.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {district.features.map((feature, i) => (
                <Badge key={i} variant="outline" className="border-slate-600 text-slate-400">
                  {feature}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderDistrictContent()}
        </motion.div>

        {/* Related Districts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-4">Explorar Otros Distritos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(DISTRICTS)
              .filter(([id]) => id !== districtId)
              .slice(0, 4)
              .map(([id, d]) => {
                const DIcon = d.icon;
                return (
                  <Link key={id} to={`/district/${id}`}>
                    <Card className="bg-slate-800/30 border-slate-700/30 p-4 hover:border-violet-500/30 transition-all group cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <DIcon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-100 text-sm">{d.name}</h4>
                      <p className="text-xs text-slate-500">{d.subtitle}</p>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </motion.div>
      </div>

      {showIsabella && (
        <IsabellaChat onClose={() => setShowIsabella(false)} />
      )}
    </div>
  );
}
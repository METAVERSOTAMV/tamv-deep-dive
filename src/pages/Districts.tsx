import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import { 
  Building2, Users, Heart, BookOpen, Brain, Zap, Coins, Sparkles, Vote,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EcosystemNav from '@/components/EcosystemNav';
import IsabellaChat from '@/components/IsabellaChat';
import TAMVDashboard from '@/components/tamv/TAMVDashboard';
import BookPIPanel from '@/components/tamv/BookPIPanel';
import KAOSAudio from '@/components/tamv/KAOSAudio';
import IDEnvida from '@/components/tamv/IDEnvida';
import TAMVCredits from '@/components/tamv/TAMVCredits';
import DAOGovernance from '@/components/tamv/DAOGovernance';

const DISTRICTS = {
  'ciudad-tamv': { id: 'ciudad-tamv', name: 'Ciudad TAMV', icon: Building2, color: 'from-violet-500 to-purple-600', component: 'dashboard' },
  'identity-anubis': { id: 'identity-anubis', name: 'ID-NVIDA', icon: Users, color: 'from-cyan-500 to-teal-500', component: 'id-envida' },
  'plaza-central': { id: 'plaza-central', name: 'Plaza Central', icon: Heart, color: 'from-pink-500 to-rose-500', component: 'social' },
  'distrito-creacion': { id: 'distrito-creacion', name: 'BookPI', icon: BookOpen, color: 'from-amber-500 to-orange-500', component: 'bookpi' },
  'conocimiento': { id: 'conocimiento', name: 'Academia', icon: Brain, color: 'from-emerald-500 to-green-500', component: 'education' },
  'energia-clima': { id: 'energia-clima', name: 'Energía', icon: Zap, color: 'from-yellow-500 to-amber-500', component: 'energy' },
  'economia-simbiotica': { id: 'economia-simbiotica', name: 'TAU', icon: Coins, color: 'from-amber-400 to-yellow-500', component: 'credits' },
  'santuario-isabella': { id: 'santuario-isabella', name: 'ISABELLA', icon: Sparkles, color: 'from-purple-500 to-violet-500', component: 'isabella' },
  'gobernanza-dao': { id: 'gobernanza-dao', name: 'DEKATEOTL', icon: Vote, color: 'from-indigo-500 to-violet-500', component: 'dao' }
};

export default function Districts() {
  const { districtId } = useParams<{ districtId: string }>();
  const [showIsabella, setShowIsabella] = useState(false);
  
  if (!districtId) return <Navigate to="/" replace />;
  const district = DISTRICTS[districtId as keyof typeof DISTRICTS];
  if (!district) return <Navigate to="/" replace />;

  const Icon = district.icon;

  const renderContent = () => {
    switch (district.component) {
      case 'dashboard': return <TAMVDashboard />;
      case 'id-envida': return <IDEnvida />;
      case 'bookpi': return <BookPIPanel />;
      case 'credits': return <TAMVCredits />;
      case 'dao': return <DAOGovernance />;
      case 'isabella':
        return (
          <div className="text-center py-20">
            <Sparkles className="w-20 h-20 text-violet-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-foreground mb-4">ISABELLA AI</h2>
            <Button 
              size="lg"
              onClick={() => setShowIsabella(true)}
              className="bg-gradient-to-r from-violet-600 to-purple-600"
            >
              Conversar
            </Button>
          </div>
        );
      default:
        return (
          <div className="text-center py-20">
            <Icon className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-black text-foreground">{district.name}</h2>
            <p className="text-muted-foreground mt-2">Próximamente</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Inicio
          </Button>
        </Link>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${district.color} flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-foreground">{district.name}</h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {renderContent()}
        </motion.div>

        {/* Quick Nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(DISTRICTS)
              .filter(([id]) => id !== districtId)
              .map(([id, d]) => {
                const DIcon = d.icon;
                return (
                  <Link key={id} to={`/district/${id}`}>
                    <Button variant="outline" className="gap-2 border-border/50">
                      <DIcon className="w-4 h-4" />
                      {d.name}
                    </Button>
                  </Link>
                );
              })}
          </div>
        </motion.div>
      </div>

      {showIsabella && <IsabellaChat onClose={() => setShowIsabella(false)} />}
    </div>
  );
}
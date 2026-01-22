import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Eye, ShoppingBag, BookOpen, Sparkles, Shield,
  ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EcosystemNav from '@/components/EcosystemNav';
import IsabellaChat from '@/components/IsabellaChat';

// Lazy load XR components for performance
const SalaDeOrigen = lazy(() => import('@/components/xr/SalaDeOrigen'));
const TorreAnubis = lazy(() => import('@/components/xr/TorreAnubis'));
const GranPlaza = lazy(() => import('@/components/xr/GranPlaza'));
const CriptaConstitucional = lazy(() => import('@/components/xr/CriptaConstitucional'));
const SalaViva = lazy(() => import('@/components/xr/SalaViva'));
const MercadoCeremonial = lazy(() => import('@/components/xr/MercadoCeremonial'));

// District configuration
const DISTRICTS = [
  {
    id: 'plaza',
    name: 'Gran Plaza',
    description: 'Centro del Distrito Fundacional',
    icon: Building2,
    component: 'GranPlaza',
    color: '#00ffff'
  },
  {
    id: 'origen',
    name: 'Sala de Origen',
    description: 'Cámara ceremonial de entrada',
    icon: Eye,
    component: 'SalaDeOrigen',
    color: '#ff00ff'
  },
  {
    id: 'isabella',
    name: 'Sala Viva',
    description: 'Santuario de Isabella AI',
    icon: Sparkles,
    component: 'SalaViva',
    color: '#ff00ff'
  },
  {
    id: 'cripta',
    name: 'Cripta Constitucional',
    description: 'Archivo de estatutos BookPI',
    icon: BookOpen,
    component: 'CriptaConstitucional',
    color: '#00ffff'
  },
  {
    id: 'mercado',
    name: 'Mercado Ceremonial',
    description: 'Economía TAU y subastas',
    icon: ShoppingBag,
    component: 'MercadoCeremonial',
    color: '#ffaa00'
  },
  {
    id: 'anubis',
    name: 'Torre de Anubis',
    description: 'Sentinel de seguridad',
    icon: Shield,
    component: 'TorreAnubis',
    color: '#00ff88'
  }
];

// Loading component for XR scenes
const XRLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-muted-foreground">Cargando espacio XR...</p>
    </div>
  </div>
);

// District selector panel
const DistrictSelector = ({ 
  currentDistrict, 
  onSelect,
  isOpen,
  onToggle
}: {
  currentDistrict: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <>
      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-background/80 backdrop-blur-xl"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-background/95 backdrop-blur-xl border-r border-border z-40 pt-20 pb-4 px-4 overflow-y-auto"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Distritos XR</h2>
            
            <div className="space-y-2">
              {DISTRICTS.map((district) => {
                const Icon = district.icon;
                const isActive = currentDistrict === district.id;
                
                return (
                  <button
                    key={district.id}
                    onClick={() => onSelect(district.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      isActive 
                        ? 'bg-primary/20 border border-primary' 
                        : 'bg-card hover:bg-muted border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${district.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: district.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{district.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{district.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* System status */}
            <div className="mt-6 p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estado del Sistema</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Operativo
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">98.7%</p>
                  <p className="text-[10px] text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">24ms</p>
                  <p className="text-[10px] text-muted-foreground">Latencia</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">1.2K</p>
                  <p className="text-[10px] text-muted-foreground">Usuarios</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// XR Controls overlay
const XRControls = ({ 
  isMuted, 
  onToggleMute,
  onFullscreen 
}: {
  isMuted: boolean;
  onToggleMute: () => void;
  onFullscreen: () => void;
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMute}
        className="bg-background/80 backdrop-blur-xl"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFullscreen}
        className="bg-background/80 backdrop-blur-xl"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-background/80 backdrop-blur-xl"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Main component
const TAMVOmniverso = () => {
  const [currentDistrict, setCurrentDistrict] = useState('plaza');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIsabella, setShowIsabella] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const renderXRScene = () => {
    const district = DISTRICTS.find(d => d.id === currentDistrict);
    if (!district) return null;

    switch (district.component) {
      case 'GranPlaza':
        return <GranPlaza className="w-full h-full" />;
      case 'SalaDeOrigen':
        return <SalaDeOrigen className="w-full h-full" />;
      case 'SalaViva':
        return <SalaViva className="w-full h-full" />;
      case 'CriptaConstitucional':
        return <CriptaConstitucional className="w-full h-full" />;
      case 'MercadoCeremonial':
        return <MercadoCeremonial className="w-full h-full" />;
      default:
        return <GranPlaza className="w-full h-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />

      {/* District selector */}
      <DistrictSelector
        currentDistrict={currentDistrict}
        onSelect={setCurrentDistrict}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* XR Scene container */}
      <div className="fixed inset-0 pt-16">
        <Suspense fallback={<XRLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDistrict}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              {renderXRScene()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* District info overlay */}
      <div className="fixed top-20 right-4 z-40">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 backdrop-blur-xl rounded-lg border border-border px-4 py-3"
        >
          <div className="flex items-center gap-3">
            {DISTRICTS.find(d => d.id === currentDistrict) && (
              <>
                {(() => {
                  const district = DISTRICTS.find(d => d.id === currentDistrict)!;
                  const Icon = district.icon;
                  return (
                    <>
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${district.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: district.color }} />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{district.name}</p>
                        <p className="text-xs text-muted-foreground">{district.description}</p>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* XR Controls */}
      <XRControls
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onFullscreen={handleFullscreen}
      />

      {/* Isabella Chat */}
      {showIsabella && <IsabellaChat onClose={() => setShowIsabella(false)} />}
    </div>
  );
};

export default TAMVOmniverso;

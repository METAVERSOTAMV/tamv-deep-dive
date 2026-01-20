import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  User, Wallet, Shield, Eye, Scale, Pyramid, Activity,
  Bell, Settings, Menu, X, ChevronRight, Zap, Globe,
  MessageCircle, Users, Music, Coins, Heart, Star,
  Lock, Fingerprint, Crown, Layers, Database, Radio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TAMVOmniverseLayoutProps {
  children: React.ReactNode;
  onIsabellaClick: () => void;
  currentMode: 'social' | 'xr' | 'governance';
  setMode: (mode: 'social' | 'xr' | 'governance') => void;
}

// MSR Reputation segments
const MSR_SEGMENTS = [
  { name: 'Wisdom', value: 45, color: 'bg-cyan-500' },
  { name: 'Community', value: 30, color: 'bg-violet-500' },
  { name: 'Creation', value: 25, color: 'bg-amber-500' },
];

// Guardian statuses
const GUARDIANS = [
  { 
    name: 'ANUBIS', 
    icon: Shield, 
    status: 'active', 
    color: 'text-emerald-400',
    description: 'Perimeter Defense',
    metric: '0 threats'
  },
  { 
    name: 'HORUS', 
    icon: Eye, 
    status: 'monitoring', 
    color: 'text-amber-400',
    description: 'Observability',
    metric: 'p99: 42ms'
  },
  { 
    name: 'DEKATEOTL', 
    icon: Scale, 
    status: 'active', 
    color: 'text-cyan-400',
    description: 'Ethical Governance',
    metric: '3 active votes'
  },
  { 
    name: 'AZTEKGODS', 
    icon: Pyramid, 
    status: 'active', 
    color: 'text-violet-400',
    description: 'MSR Economy',
    metric: '+1.2% today'
  },
];

const TAMVOmniverseLayout = ({ children, onIsabellaClick, currentMode, setMode }: TAMVOmniverseLayoutProps) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Panel - Identity & Sovereignty */}
      <AnimatePresence>
        {leftPanelOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 bg-card/80 backdrop-blur-xl border-r border-border flex flex-col fixed left-0 top-0 h-screen z-40"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4">
                {/* Avatar Holographic */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-violet-500 to-amber-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur-md opacity-30 animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">Ciudadano TAMV</h3>
                  <p className="text-sm text-muted-foreground">@anubis_pioneer</p>
                </div>
              </div>

              {/* MSR Reputation Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reputación MSR</span>
                  <span className="font-bold text-primary">847</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                  {MSR_SEGMENTS.map((seg, i) => (
                    <div 
                      key={i} 
                      className={`${seg.color} transition-all`}
                      style={{ width: `${seg.value}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  {MSR_SEGMENTS.map((seg, i) => (
                    <span key={i}>{seg.name}: {seg.value}%</span>
                  ))}
                </div>
              </div>

              {/* Founder Badge */}
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black gap-1">
                  <Crown className="w-3 h-3" />
                  Fundador 500
                </Badge>
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 gap-1">
                  <Star className="w-3 h-3" />
                  Verificado
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <ScrollArea className="flex-1 p-4">
              <nav className="space-y-2">
                {[
                  { icon: Fingerprint, label: 'ID-NVIDA', desc: 'Identidad Cuántica', path: '/district/identity-anubis' },
                  { icon: Wallet, label: 'NubiWallet', desc: '1,247 TAMV', path: '/district/economia-simbiotica' },
                  { icon: Crown, label: 'Membresía', desc: 'Gold Pioneer', path: '/district/economia-simbiotica' },
                  { icon: Globe, label: 'DreamSpace', desc: 'Mi Parcela XR', path: '/dreamweave' },
                  { icon: Music, label: 'KAOS Audio', desc: '3 playlists', path: '/district/kaos-audio' },
                  { icon: Users, label: 'Comunidad', desc: '12 conexiones', path: '/district/santuario-isabella' },
                ].map((item, i) => (
                  <Link key={i} to={item.path}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 cursor-pointer transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </Link>
                ))}
              </nav>

              {/* Isabella Quick Chat */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Isabella</p>
                    <p className="text-xs text-muted-foreground">IA Emocional</p>
                  </div>
                </div>
                <Button 
                  onClick={onIsabellaClick}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Conversar
                </Button>
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${leftPanelOpen ? 'ml-80' : 'ml-0'} ${rightPanelOpen ? 'mr-72' : 'mr-0'}`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Mode Toggle */}
              <div className="flex items-center bg-muted rounded-xl p-1">
                {(['social', 'xr', 'governance'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      currentMode === mode 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode === 'xr' ? 'XR/3D' : mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Selector */}
              <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Layers className="w-3 h-3 mr-1" />
                Creador
              </Badge>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
              >
                <Activity className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Right Panel - Guardians & System Status */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-72 bg-card/80 backdrop-blur-xl border-l border-border fixed right-0 top-0 h-screen z-40 flex flex-col"
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                Guardianes del Sistema
              </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {GUARDIANS.map((guardian, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center ${guardian.color}`}>
                        <guardian.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{guardian.name}</p>
                          <div className={`w-2 h-2 rounded-full ${
                            guardian.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                          } animate-pulse`} />
                        </div>
                        <p className="text-xs text-muted-foreground">{guardian.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-mono text-primary">
                      {guardian.metric}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* TENOCHTITLAN Security Map */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Pyramid className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold text-sm">TENOCHTITLAN</h4>
                </div>
                
                {/* Network visualization */}
                <div className="relative h-24 bg-card/50 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-emerald-500 rounded-full"
                        style={{
                          left: `${15 + (i % 3) * 30}%`,
                          top: `${20 + Math.floor(i / 3) * 30}%`,
                        }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      <line x1="15%" y1="20%" x2="45%" y2="20%" stroke="currentColor" className="text-primary" />
                      <line x1="45%" y1="20%" x2="75%" y2="20%" stroke="currentColor" className="text-primary" />
                      <line x1="15%" y1="50%" x2="45%" y2="50%" stroke="currentColor" className="text-primary" />
                      <line x1="45%" y1="50%" x2="75%" y2="50%" stroke="currentColor" className="text-primary" />
                      <line x1="15%" y1="20%" x2="15%" y2="50%" stroke="currentColor" className="text-primary" />
                      <line x1="75%" y1="20%" x2="75%" y2="50%" stroke="currentColor" className="text-primary" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Ciudad-escudo: <span className="text-emerald-400 font-bold">0</span> ataques contenidos hoy
                </p>
              </div>

              {/* System Metrics */}
              <div className="mt-6 space-y-4">
                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Métricas del Sistema
                </h4>
                
                {[
                  { label: 'Latencia p99', value: 42, max: 100, unit: 'ms', color: 'bg-cyan-500' },
                  { label: 'CPU', value: 34, max: 100, unit: '%', color: 'bg-emerald-500' },
                  { label: 'Memoria', value: 67, max: 100, unit: '%', color: 'bg-amber-500' },
                  { label: 'Network I/O', value: 12, max: 100, unit: 'MB/s', color: 'bg-violet-500' },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-mono">{metric.value}{metric.unit}</span>
                    </div>
                    <Progress value={metric.value} className="h-1" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle buttons for collapsed panels */}
      {!leftPanelOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLeftPanelOpen(true)}
          className="fixed left-4 top-4 z-50"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default TAMVOmniverseLayout;

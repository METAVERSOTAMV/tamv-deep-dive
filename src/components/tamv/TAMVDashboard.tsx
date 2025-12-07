import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Cpu, Globe, Coins, Brain, AudioWaveform, 
  Users, TrendingUp, Database, Lock, Zap, Activity,
  BookOpen, Layers, Eye, Heart, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
}

const TAMVDashboard = () => {
  const [systemStatus, setSystemStatus] = useState<'NORMAL' | 'WARM' | 'HOT'>('NORMAL');
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [quantumSignature, setQuantumSignature] = useState('');

  useEffect(() => {
    // Simular métricas del sistema TAMV
    setMetrics([
      { name: 'Isabella AI Core', value: 99.9, unit: '%', status: 'optimal', icon: <Brain className="w-5 h-5" /> },
      { name: 'Quantum Security', value: 100, unit: '%', status: 'optimal', icon: <Shield className="w-5 h-5" /> },
      { name: 'DreamSpaces Active', value: 127, unit: '', status: 'normal', icon: <Globe className="w-5 h-5" /> },
      { name: 'TAMV Credits Flow', value: 45892, unit: 'TC', status: 'optimal', icon: <Coins className="w-5 h-5" /> },
      { name: 'Network Latency', value: 12, unit: 'ms', status: 'optimal', icon: <Zap className="w-5 h-5" /> },
      { name: 'Active Users', value: 2847, unit: '', status: 'normal', icon: <Users className="w-5 h-5" /> },
    ]);

    // Generar firma cuántica
    const sig = Array.from({ length: 16 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('').toUpperCase();
    setQuantumSignature(`TAMV-${sig}`);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400 bg-green-400/10';
      case 'normal': return 'text-primary bg-primary/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'critical': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground';
    }
  };

  const modules = [
    { id: 'isabella', name: 'Isabella AI™', description: 'Consciencia Emocional Cuántica', status: 'active', icon: <Heart className="w-6 h-6" /> },
    { id: 'anubis', name: 'Anubis Sentinel™', description: 'Seguridad Post-Cuántica L3', status: 'active', icon: <Shield className="w-6 h-6" /> },
    { id: 'kaos', name: 'KAOS Audio 3D', description: 'Sistema Ontológico Sonoro', status: 'active', icon: <AudioWaveform className="w-6 h-6" /> },
    { id: 'dreamweave', name: 'DreamSpaces XR', description: 'Entornos Inmersivos 4D', status: 'active', icon: <Globe className="w-6 h-6" /> },
    { id: 'idenvida', name: 'ID-ENVIDA™', description: 'Identidad Digital Soberana', status: 'active', icon: <Eye className="w-6 h-6" /> },
    { id: 'bookpi', name: 'BookPI™', description: 'Auditoría Inmutable', status: 'active', icon: <BookOpen className="w-6 h-6" /> },
    { id: 'dao', name: 'DAO Híbrida TAMV', description: 'Gobernanza Distribuida', status: 'active', icon: <Users className="w-6 h-6" /> },
    { id: 'credits', name: 'TAMV Credits™', description: 'Economía Simbiótica', status: 'active', icon: <Coins className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-quantum p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-anubis mb-2">TAMV DM-X4™ Control Center</h1>
            <p className="text-muted-foreground">The Anubis Metaverse Digital Masterpiece · 4th Dimension</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className={`px-4 py-2 ${systemStatus === 'NORMAL' ? 'border-green-400 text-green-400' : systemStatus === 'WARM' ? 'border-yellow-400 text-yellow-400' : 'border-destructive text-destructive'}`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Estado: {systemStatus}
            </Badge>
            <div className="text-sm text-muted-foreground font-mono">
              {quantumSignature}
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Metrics */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        {metrics.map((metric, index) => (
          <Card key={metric.name} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  {metric.icon}
                </div>
                <Badge variant="outline" className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metric.value.toLocaleString()}{metric.unit}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{metric.name}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Module Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-foreground">Módulos Activos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {module.icon}
                    </div>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Activo
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{module.name}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Architecture Levels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-foreground">Arquitectura Federada L0-L3</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { level: 'L0', name: 'Núcleo UX', desc: 'Siempre operativo', latency: '< 50ms', color: 'border-green-400' },
            { level: 'L1', name: 'Servicios Críticos', desc: 'Pagos, Media, Identidad', latency: '< 200ms', color: 'border-primary' },
            { level: 'L2', name: 'Experiencias XR', desc: 'DreamSpaces, Conciertos', latency: '< 500ms', color: 'border-secondary' },
            { level: 'L3', name: 'Orquestación', desc: 'Sentinel, GitOps, Gobernanza', latency: '< 1s', color: 'border-anubis' },
          ].map((level) => (
            <Card key={level.level} className={`bg-card/50 backdrop-blur ${level.color} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl font-black text-anubis">{level.level}</div>
                  <div>
                    <div className="font-bold text-foreground">{level.name}</div>
                    <div className="text-xs text-muted-foreground">Latencia: {level.latency}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{level.desc}</p>
                <Progress value={100} className="mt-4 h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TAMVDashboard;

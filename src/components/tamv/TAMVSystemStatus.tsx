import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Shield, Brain, Coins, Users, Activity, 
  CheckCircle, AlertTriangle, Zap, Database, Globe, Lock,
  Cpu, HardDrive, Wifi, Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  icon: React.ElementType;
  description: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  activeUsers: number;
  totalUsers: number;
  requestsPerMinute: number;
  transactionsToday: number;
  isabellaQueries: number;
  securityScore: number;
  blockchainBlocks: number;
}

const TAMVSystemStatus = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Isabella AI', status: 'operational', latency: 45, uptime: 99.99, icon: Brain, description: 'Motor de IA Emocional' },
    { name: 'ANUBIS Security', status: 'operational', latency: 12, uptime: 100, icon: Shield, description: 'Sistema de Seguridad' },
    { name: 'TAU Economy', status: 'operational', latency: 23, uptime: 99.95, icon: Coins, description: 'Motor Económico' },
    { name: 'ID-NVIDA', status: 'operational', latency: 18, uptime: 99.99, icon: Lock, description: 'Identidad Cuántica' },
    { name: 'DEKATEOTL DAO', status: 'operational', latency: 56, uptime: 99.90, icon: Globe, description: 'Gobernanza' },
    { name: 'BookPI Ledger', status: 'operational', latency: 8, uptime: 100, icon: Database, description: 'Registro Inmutable' },
    { name: 'DreamSpaces XR', status: 'operational', latency: 89, uptime: 99.85, icon: Zap, description: 'Espacios 3D' },
    { name: 'KAOS Audio', status: 'operational', latency: 34, uptime: 99.92, icon: Activity, description: 'Audio 3D/4D' },
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 42,
    memory: 67,
    storage: 34,
    activeUsers: 1247,
    totalUsers: 15892,
    requestsPerMinute: 3456,
    transactionsToday: 8934,
    isabellaQueries: 24567,
    securityScore: 98,
    blockchainBlocks: 1892456
  });

  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Simulate live metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(40, prev.memory + (Math.random() - 0.5) * 5)),
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.3) * 10),
        requestsPerMinute: Math.floor(prev.requestsPerMinute + (Math.random() - 0.5) * 200),
        transactionsToday: prev.transactionsToday + Math.floor(Math.random() * 5),
        isabellaQueries: prev.isabellaQueries + Math.floor(Math.random() * 10),
        blockchainBlocks: prev.blockchainBlocks + (Math.random() > 0.9 ? 1 : 0)
      }));

      // Random latency updates
      setServices(prev => prev.map(s => ({
        ...s,
        latency: Math.max(5, s.latency + Math.floor((Math.random() - 0.5) * 10))
      })));

      setUptime(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Operacional</Badge>;
      case 'degraded': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Degradado</Badge>;
      case 'down': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Caído</Badge>;
      default: return <Badge>Desconocido</Badge>;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const allOperational = services.every(s => s.status === 'operational');

  return (
    <div className="space-y-8">
      {/* Overall Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`p-6 ${allOperational ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {allOperational ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {allOperational ? 'Todos los Sistemas Operacionales' : 'Algunos Sistemas Degradados'}
                </h2>
                <p className="text-muted-foreground">
                  Última actualización: {new Date().toLocaleString('es-MX')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Uptime de sesión</div>
              <div className="text-xl font-mono">{formatUptime(uptime)}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Infrastructure Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">CPU</span>
          </div>
          <div className="text-3xl font-bold mb-2">{metrics.cpu.toFixed(1)}%</div>
          <Progress value={metrics.cpu} className="h-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Memoria</span>
          </div>
          <div className="text-3xl font-bold mb-2">{metrics.memory.toFixed(1)}%</div>
          <Progress value={metrics.memory} className="h-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Usuarios Activos</span>
          </div>
          <div className="text-3xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">de {metrics.totalUsers.toLocaleString()} total</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Wifi className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Requests/min</span>
          </div>
          <div className="text-3xl font-bold">{metrics.requestsPerMinute.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Tráfico actual</div>
        </Card>
      </div>

      {/* Module Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-purple-500/10 border-purple-500/30">
          <Brain className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-2xl font-bold">{metrics.isabellaQueries.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Consultas Isabella</div>
        </Card>

        <Card className="p-4 bg-amber-500/10 border-amber-500/30">
          <Coins className="w-6 h-6 text-amber-400 mb-2" />
          <div className="text-2xl font-bold">{metrics.transactionsToday.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Transacciones Hoy</div>
        </Card>

        <Card className="p-4 bg-cyan-500/10 border-cyan-500/30">
          <Shield className="w-6 h-6 text-cyan-400 mb-2" />
          <div className="text-2xl font-bold">{metrics.securityScore}%</div>
          <div className="text-sm text-muted-foreground">Score Seguridad</div>
        </Card>

        <Card className="p-4 bg-indigo-500/10 border-indigo-500/30">
          <Database className="w-6 h-6 text-indigo-400 mb-2" />
          <div className="text-2xl font-bold">{metrics.blockchainBlocks.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Bloques BookPI</div>
        </Card>
      </div>

      {/* Services Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">Estado de Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 hover:bg-card/80 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)} animate-pulse`} />
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  {getStatusBadge(service.status)}
                </div>
                <h4 className="font-bold mb-1">{service.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{service.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {service.latency}ms
                  </span>
                  <span className="text-green-400">{service.uptime}% uptime</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Events Timeline */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Eventos Recientes</h3>
        <div className="space-y-3">
          {[
            { time: 'Hace 2 min', event: 'Isabella procesó 150 consultas', type: 'info' },
            { time: 'Hace 5 min', event: 'Nuevo bloque añadido a BookPI', type: 'success' },
            { time: 'Hace 12 min', event: 'Actualización de seguridad ANUBIS', type: 'security' },
            { time: 'Hace 30 min', event: 'Propuesta DAO #1892 aprobada', type: 'governance' },
            { time: 'Hace 1 hora', event: 'Sistema DreamSpaces optimizado', type: 'performance' },
          ].map((event, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground w-24">{event.time}</div>
              <div className={`w-2 h-2 rounded-full ${
                event.type === 'success' ? 'bg-green-500' :
                event.type === 'security' ? 'bg-cyan-500' :
                event.type === 'governance' ? 'bg-purple-500' :
                event.type === 'performance' ? 'bg-amber-500' :
                'bg-blue-500'
              }`} />
              <div className="text-sm">{event.event}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TAMVSystemStatus;

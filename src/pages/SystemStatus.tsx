import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, Server, Database, Shield, Cpu, Globe, 
  CheckCircle, AlertTriangle, XCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import EcosystemNav from '@/components/EcosystemNav';
import IsabellaChat from '@/components/IsabellaChat';

interface SystemService {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  latency: number;
  uptime: number;
  description: string;
  icon: typeof Activity;
}

export default function SystemStatus() {
  const [showIsabella, setShowIsabella] = useState(false);
  const [services, setServices] = useState<SystemService[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setIsRefreshing(true);
    // Simulated service status
    setTimeout(() => {
      setServices([
        { name: 'Isabella AI™', status: 'operational', latency: 45, uptime: 99.98, description: 'Sistema de IA emocional', icon: Cpu },
        { name: 'TAMV API', status: 'operational', latency: 23, uptime: 99.99, description: 'API principal del ecosistema', icon: Server },
        { name: 'DreamSpaces 3D', status: 'operational', latency: 89, uptime: 99.95, description: 'Motor de espacios inmersivos', icon: Globe },
        { name: 'BookPI Ledger', status: 'operational', latency: 34, uptime: 99.97, description: 'Registro de propiedad intelectual', icon: Database },
        { name: 'Anubis Sentinel', status: 'operational', latency: 12, uptime: 99.99, description: 'Sistema de seguridad', icon: Shield },
        { name: 'KAOS Audio 3D', status: 'operational', latency: 56, uptime: 99.94, description: 'Motor de audio espacial', icon: Activity },
      ]);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'outage': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'degraded': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'outage': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const allOperational = services.every(s => s.status === 'operational');
  const avgUptime = services.length > 0 
    ? (services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(2)
    : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <EcosystemNav onIsabellaClick={() => setShowIsabella(true)} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-100">Estado del Sistema</h1>
              <p className="text-slate-400">Monitoreo en tiempo real de los servicios TAMV</p>
            </div>
            <Button 
              variant="outline" 
              onClick={loadServices}
              disabled={isRefreshing}
              className="border-slate-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`p-6 ${allOperational ? 'bg-green-900/20 border-green-500/30' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
            <div className="flex items-center gap-4">
              {allOperational ? (
                <CheckCircle className="w-12 h-12 text-green-400" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-yellow-400" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  {allOperational ? 'Todos los sistemas operativos' : 'Algunos servicios degradados'}
                </h2>
                <p className="text-slate-400">
                  Uptime promedio: {avgUptime}% | Última actualización: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-slate-100">Servicios</h3>
          
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-violet-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-100">{service.name}</h4>
                        {getStatusIcon(service.status)}
                        <Badge className={getStatusColor(service.status)}>
                          {service.status === 'operational' ? 'Operativo' : 
                           service.status === 'degraded' ? 'Degradado' : 'Interrupción'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{service.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Latencia</p>
                      <p className="text-lg font-semibold text-slate-100">{service.latency}ms</p>
                    </div>
                    
                    <div className="w-32">
                      <p className="text-sm text-slate-400 mb-1">Uptime</p>
                      <Progress value={service.uptime} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">{service.uptime}%</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Incident History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-4">Historial de Incidentes (90 días)</h3>
          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-slate-100 font-semibold">Sin incidentes reportados</p>
                <p className="text-sm text-slate-400">El sistema ha mantenido un uptime del 99.97% en los últimos 90 días</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {showIsabella && (
        <IsabellaChat onClose={() => setShowIsabella(false)} />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Lock, Eye, Activity, Zap,
  Server, Wifi, Ban, CheckCircle, XCircle, RefreshCw,
  Database, Globe, Key, Fingerprint, Radar, Bug
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ThreatEvent {
  id: string;
  type: 'ddos' | 'intrusion' | 'malware' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: Date;
  status: 'blocked' | 'investigating' | 'resolved';
  description: string;
}

const HONEYPOT_LAYERS = [
  { level: 0, name: 'Edge/Gateway', nodes: 12, status: 'active' },
  { level: 1, name: 'Orquestador', nodes: 8, status: 'active' },
  { level: 2, name: 'Microservicios', nodes: 24, status: 'active' },
  { level: 3, name: 'Honeynet Interna', nodes: 48, status: 'active' },
  { level: 4, name: 'Núcleo Real', nodes: 6, status: 'protected' },
];

const AnubisSecurityPanel = () => {
  const [threats, setThreats] = useState<ThreatEvent[]>([
    {
      id: '1',
      type: 'ddos',
      severity: 'high',
      source: '192.168.1.xxx',
      timestamp: new Date(),
      status: 'blocked',
      description: 'DDoS attempt detected and mitigated'
    }
  ]);
  const [systemHealth, setSystemHealth] = useState(98);
  const [blockedToday, setBlockedToday] = useState(47);
  const [activeConnections, setActiveConnections] = useState(1247);
  const [isScanning, setIsScanning] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-amber-500 text-black';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked': return <Ban className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Eye className="w-4 h-4 text-amber-500" />;
      default: return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    }
  };

  const runSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSystemHealth(99);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black">ANUBIS SENTINEL</h1>
            <p className="text-muted-foreground">Sistema de Seguridad TENOCHTITLAN</p>
          </div>
        </div>
        <Button 
          onClick={runSecurityScan}
          disabled={isScanning}
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Escaneando...' : 'Escanear Sistema'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Salud del Sistema', 
            value: `${systemHealth}%`, 
            icon: Activity,
            color: 'text-emerald-500',
            progress: systemHealth
          },
          { 
            label: 'Amenazas Bloqueadas', 
            value: blockedToday, 
            icon: Ban,
            color: 'text-red-500',
            subtitle: 'Hoy'
          },
          { 
            label: 'Conexiones Activas', 
            value: activeConnections.toLocaleString(), 
            icon: Wifi,
            color: 'text-cyan-500'
          },
          { 
            label: 'Capas Honeypot', 
            value: '5 Niveles', 
            icon: Server,
            color: 'text-amber-500'
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-2xl font-black">{metric.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                {metric.progress && (
                  <Progress value={metric.progress} className="h-1 mt-2" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="honeypot" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="honeypot">Honeypot</TabsTrigger>
          <TabsTrigger value="threats">Amenazas</TabsTrigger>
          <TabsTrigger value="firewall">Firewall</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="honeypot" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-500" />
                Arquitectura de Defensa en Capas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {HONEYPOT_LAYERS.map((layer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${
                      layer.level === 4 
                        ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30' 
                        : 'bg-muted/30 border-border'
                    }`}>
                      <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center">
                        <span className="text-2xl font-black text-primary">L{layer.level}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{layer.name}</h4>
                          <Badge variant={layer.status === 'protected' ? 'default' : 'outline'}>
                            {layer.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {layer.nodes} nodos {layer.level === 4 ? 'protegidos' : 'señuelo'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, j) => (
                          <motion.div
                            key={j}
                            className={`w-2 h-2 rounded-full ${
                              layer.status === 'protected' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, delay: j * 0.2, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {i < HONEYPOT_LAYERS.length - 1 && (
                      <div className="absolute left-10 top-full w-0.5 h-4 bg-border" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <Bug className="w-6 h-6 text-red-500" />
                  <div>
                    <h4 className="font-bold">Protocolo de Confusión Activo</h4>
                    <p className="text-sm text-muted-foreground">
                      Los atacantes se perderán en +500 capas de señuelos antes de alcanzar el núcleo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Eventos de Seguridad Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threats.map((threat) => (
                  <div 
                    key={threat.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    {getStatusIcon(threat.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold capitalize">{threat.type}</span>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{threat.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Source: {threat.source} • {threat.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {threat.status}
                    </Badge>
                  </div>
                ))}

                {threats.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay amenazas activas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-500" />
                Reglas de Firewall Zero Trust
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { rule: 'MFA Obligatorio', status: 'active', icon: Key },
                  { rule: 'Rate Limiting', status: 'active', icon: Zap },
                  { rule: 'Geoblocking', status: 'active', icon: Globe },
                  { rule: 'Fingerprint Device', status: 'active', icon: Fingerprint },
                  { rule: 'mTLS entre servicios', status: 'active', icon: Lock },
                  { rule: 'WAF Protection', status: 'active', icon: Shield },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.rule}</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-violet-500" />
                Registro de Auditoría Inmutable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Radar className="w-12 h-12 text-violet-500 mx-auto mb-4 animate-pulse" />
                <p className="font-bold mb-2">BookPI Integration</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Todos los eventos de seguridad son registrados inmutablemente con hash SHA-512
                </p>
                <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  247 eventos anclados hoy
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisSecurityPanel;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Activity, TrendingUp, TrendingDown, AlertCircle,
  Server, Cpu, HardDrive, Wifi, Clock, Gauge, LineChart,
  BarChart3, PieChart, RefreshCw, Zap, Database, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MetricData {
  timestamp: Date;
  value: number;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  requests: number;
}

const HorusObservability = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'TAMV API', status: 'healthy', latency: 42, uptime: 99.97, requests: 15420 },
    { name: 'Isabella AI', status: 'healthy', latency: 156, uptime: 99.89, requests: 8734 },
    { name: 'DreamSpaces XR', status: 'healthy', latency: 89, uptime: 99.95, requests: 3421 },
    { name: 'KAOS Audio', status: 'healthy', latency: 34, uptime: 99.99, requests: 12098 },
    { name: 'MSR Chain', status: 'healthy', latency: 245, uptime: 99.92, requests: 5672 },
    { name: 'BookPI', status: 'healthy', latency: 67, uptime: 99.98, requests: 4521 },
  ]);
  
  const [metrics, setMetrics] = useState({
    p50: 28,
    p95: 89,
    p99: 156,
    errorRate: 0.02,
    throughput: 45230,
    activeUsers: 1247,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      default: return 'bg-red-500';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-emerald-500';
    if (latency < 300) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
            <Eye className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black">HORUS OBSERVABILITY</h1>
            <p className="text-muted-foreground">Sistema de Monitoreo y SLOs</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-lg px-4 py-2">
          <Activity className="w-4 h-4 mr-2" />
          Sistema Operativo
        </Badge>
      </div>

      {/* Key Latency Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'p50', value: metrics.p50, unit: 'ms', color: 'text-emerald-500' },
          { label: 'p95', value: metrics.p95, unit: 'ms', color: 'text-amber-500' },
          { label: 'p99', value: metrics.p99, unit: 'ms', color: 'text-orange-500' },
          { label: 'Error Rate', value: metrics.errorRate, unit: '%', color: 'text-red-500' },
          { label: 'Throughput', value: `${(metrics.throughput / 1000).toFixed(1)}k`, unit: 'req/s', color: 'text-cyan-500' },
          { label: 'Active Users', value: metrics.activeUsers.toLocaleString(), unit: '', color: 'text-violet-500' },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card/50 border-border text-center">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {metric.label}
                </p>
                <p className={`text-2xl font-black ${metric.color}`}>
                  {metric.value}{metric.unit}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Real-time Graph Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-cyan-500" />
            Latencia en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/30 rounded-xl flex items-end justify-around p-4">
            {[...Array(20)].map((_, i) => {
              const height = 20 + Math.random() * 60;
              return (
                <motion.div
                  key={i}
                  className="w-3 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ 
                    duration: 0.5, 
                    delay: i * 0.05,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 2
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>-5 min</span>
            <span>-4 min</span>
            <span>-3 min</span>
            <span>-2 min</span>
            <span>-1 min</span>
            <span>Ahora</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="infra">Infraestructura</TabsTrigger>
          <TabsTrigger value="slos">SLOs</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                        <h4 className="font-bold">{service.name}</h4>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {service.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className={`text-lg font-bold ${getLatencyColor(service.latency)}`}>
                          {service.latency}ms
                        </p>
                        <p className="text-xs text-muted-foreground">Latency</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-500">
                          {service.uptime}%
                        </p>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-cyan-500">
                          {(service.requests / 1000).toFixed(1)}k
                        </p>
                        <p className="text-xs text-muted-foreground">Requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="infra" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'CPU Usage', value: 34, icon: Cpu, color: 'from-cyan-500 to-blue-500' },
              { name: 'Memory', value: 67, icon: Server, color: 'from-violet-500 to-purple-500' },
              { name: 'Disk I/O', value: 23, icon: HardDrive, color: 'from-amber-500 to-orange-500' },
              { name: 'Network', value: 45, icon: Wifi, color: 'from-emerald-500 to-green-500' },
            ].map((resource, i) => (
              <Card key={i} className="bg-card/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center`}>
                      <resource.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">{resource.name}</p>
                      <p className="text-2xl font-black">{resource.value}%</p>
                    </div>
                  </div>
                  <Progress value={resource.value} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Kubernetes Pods */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-violet-500" />
                Kubernetes Pods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
                  >
                    <Server className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                24 pods running • 0 pending • 0 failed
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Availability', target: 99.9, current: 99.97, unit: '%' },
              { name: 'Latency p99', target: 200, current: 156, unit: 'ms', inverse: true },
              { name: 'Error Rate', target: 0.1, current: 0.02, unit: '%', inverse: true },
              { name: 'Throughput', target: 10000, current: 45230, unit: 'req/s' },
            ].map((slo, i) => {
              const isGood = slo.inverse ? slo.current < slo.target : slo.current >= slo.target;
              return (
                <Card key={i} className={`border ${isGood ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg">{slo.name}</h4>
                      <Badge className={isGood ? 'bg-emerald-500' : 'bg-red-500'}>
                        {isGood ? 'Meeting SLO' : 'Below SLO'}
                      </Badge>
                    </div>
                    <div className="flex items-end gap-4">
                      <div>
                        <p className="text-4xl font-black">
                          {slo.current}{slo.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Target: {slo.target}{slo.unit}
                        </p>
                      </div>
                      {isGood ? (
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sin Alertas Activas</h3>
              <p className="text-muted-foreground">
                Todos los sistemas operando dentro de los SLOs definidos
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HorusObservability;

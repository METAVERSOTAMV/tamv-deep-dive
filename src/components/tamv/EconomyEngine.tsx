import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, PieChart, Settings, 
  Shield, Zap, AlertTriangle, CheckCircle,
  ArrowUpRight, ArrowDownRight, Activity, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const revenueSources = [
  { id: 'memberships', name: 'Membresías', type: 'recurring', arpu: 25, margin: 85, status: 'active' },
  { id: 'marketplace', name: 'Marketplace XR', type: 'transactional', arpu: 12, margin: 75, status: 'active' },
  { id: 'gifts', name: 'Gifts XR', type: 'transactional', arpu: 8, margin: 80, status: 'active' },
  { id: 'utamv', name: 'UTAMV Cursos', type: 'commission', arpu: 50, margin: 70, status: 'active' },
  { id: 'isabella', name: 'Licencias Isabella', type: 'saas', arpu: 300, margin: 90, status: 'active' },
  { id: 'lottery', name: 'Lotería', type: 'transactional', arpu: 15, margin: 50, status: 'active' },
  { id: 'events', name: 'Eventos XR', type: 'transactional', arpu: 35, margin: 65, status: 'active' },
  { id: 'hosting', name: 'Hosting XR', type: 'usage', arpu: 20, margin: 60, status: 'active' },
  { id: 'render', name: 'Render 4D', type: 'credits', arpu: 45, margin: 55, status: 'active' },
  { id: 'bookpi', name: 'BookPI Auditoría', type: 'service', arpu: 100, margin: 80, status: 'active' },
  { id: 'enterprise', name: 'Enterprise/B2B', type: 'contract', arpu: 500, margin: 75, status: 'active' },
  { id: 'whitelabel', name: 'White-label', type: 'license', arpu: 1000, margin: 85, status: 'planned' }
];

const economicTriggers = [
  { id: 'margin_low', condition: 'Margen < 65%', action: 'Subir precio automático', status: 'armed' },
  { id: 'infra_high', condition: 'Infra > 30% utilidad', action: 'Ajustar límites', status: 'armed' },
  { id: 'xr_extreme', condition: 'Uso XR extremo', action: 'Convertir a créditos', status: 'armed' },
  { id: 'cac_ltv', condition: 'CAC > LTV/3', action: 'Apagar canal', status: 'monitoring' },
  { id: 'arpu_drop', condition: 'ARPU ↓ 10%', action: 'Reempaquetar planes', status: 'monitoring' }
];

const EconomyEngine = () => {
  const [selectedView, setSelectedView] = useState('overview');

  const totalRevenue = 185000;
  const totalCosts = 52000;
  const netUtility = totalRevenue - totalCosts;
  const marginPercent = ((netUtility / totalRevenue) * 100).toFixed(1);

  const fenixAmount = netUtility * 0.20;
  const infraAmount = netUtility * 0.30;
  const reserveAmount = netUtility * 0.50;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Activity className="w-10 h-10 text-primary" />
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Motor Económico TAMV
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema económico civilizatorio con 33+ fuentes de ingreso, reparto automático 20/30/50 
          y protocolos de defensa cero-pérdida
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos', value: `$${(totalRevenue/1000).toFixed(0)}K`, change: '+18%', positive: true, icon: TrendingUp },
          { label: 'Margen', value: `${marginPercent}%`, change: '+2.3%', positive: true, icon: PieChart },
          { label: 'MAU', value: '47.2K', change: '+12%', positive: true, icon: Activity },
          { label: 'Break-even', value: '11K', change: 'Superado', positive: true, icon: CheckCircle }
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <Badge variant={metric.positive ? 'default' : 'destructive'} className="text-xs">
                      {metric.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-black">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Distribución Automática 20/30/50
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <div className="text-4xl font-black text-emerald-500">20%</div>
              <div className="text-lg font-semibold mt-2">Protocolo Fénix</div>
              <div className="text-2xl font-bold text-emerald-500 mt-2">
                ${fenixAmount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Becas, justicia digital, reparación
              </div>
              <Progress value={100} className="h-2 mt-4 bg-emerald-500/20" />
            </div>

            <div className="text-center p-6 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <div className="text-4xl font-black text-blue-500">30%</div>
              <div className="text-lg font-semibold mt-2">Infraestructura</div>
              <div className="text-2xl font-bold text-blue-500 mt-2">
                ${infraAmount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Servidores, seguridad, desarrollo
              </div>
              <Progress value={100} className="h-2 mt-4 bg-blue-500/20" />
            </div>

            <div className="text-center p-6 bg-primary/10 rounded-xl border border-primary/30">
              <div className="text-4xl font-black text-primary">50%</div>
              <div className="text-lg font-semibold mt-2">Reserva Estratégica</div>
              <div className="text-2xl font-bold text-primary mt-2">
                ${reserveAmount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Expansión, I+D, protección legal
              </div>
              <Progress value={100} className="h-2 mt-4 bg-primary/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              33 Fuentes de Ingreso
            </span>
            <Badge variant="outline">{revenueSources.length} activas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {revenueSources.map((source, i) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-3 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{source.name}</span>
                  <Badge 
                    variant={source.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {source.status === 'active' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Settings className="w-3 h-3 mr-1" />
                    )}
                    {source.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Tipo</div>
                    <div className="font-medium">{source.type}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ARPU</div>
                    <div className="font-medium text-primary">${source.arpu}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Margen</div>
                    <div className="font-medium text-emerald-500">{source.margin}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Defense Protocols */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Protocolos de Defensa Cero-Pérdida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {economicTriggers.map((trigger) => (
              <div 
                key={trigger.id}
                className="p-3 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{trigger.condition}</span>
                  <Badge 
                    variant={trigger.status === 'armed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {trigger.status === 'armed' ? (
                      <Zap className="w-3 h-3 mr-1" />
                    ) : (
                      <Activity className="w-3 h-3 mr-1" />
                    )}
                    {trigger.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  → {trigger.action}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Protocolo Hoyo Negro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Estado: Standby</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Sistema de emergencia para congelar, reetiquetar y reasignar fondos 
                en caso de fraude o anomalías económicas.
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Última activación</span>
                <span>Nunca</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transacciones monitoreadas</span>
                <span>847,293</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Anomalías detectadas</span>
                <span className="text-emerald-500">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Economic Principles */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Regla de Oro Inmutable</h3>
            <p className="text-lg text-primary font-medium">
              "Nada en TAMV consume recursos reales sin estar anclado a una entrada de valor real, medible y auditable."
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Plataforma Propietaria', desc: 'No intermediaria débil' },
              { label: 'Infraestructura Anti-Burn', desc: 'Sin gastos sin retorno' },
              { label: 'Economía Resiliente', desc: 'Antifrágil por diseño' },
              { label: 'Sistema Auditable', desc: 'Histórica y académicamente' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-background/50 rounded-lg">
                <CheckCircle className="w-6 h-6 mx-auto text-primary mb-2" />
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomyEngine;

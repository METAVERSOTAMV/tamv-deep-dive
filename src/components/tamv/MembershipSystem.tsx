import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Star, Diamond, Gem, Shield, Check, Zap, 
  Users, Sparkles, TrendingUp, Lock, Award, Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const membershipTiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    color: 'from-slate-500 to-slate-600',
    icon: Users,
    badge: 'Ciudadano',
    benefits: [
      'Acceso básico al ecosistema',
      'Feed social limitado',
      'Chat con Isabella (5/día)',
      'Exploración DreamSpaces públicos',
      'Perfil básico ID-NVIDA'
    ],
    limits: {
      xrMinutes: 30,
      storageGB: 1,
      iaRequests: 5,
      commission: 35
    }
  },
  {
    id: 'pioneer',
    name: 'Pioneer',
    price: 9.99,
    color: 'from-emerald-500 to-teal-600',
    icon: Rocket,
    badge: 'Pionero',
    popular: false,
    benefits: [
      'Todo de Free +',
      'DreamSpace personal (1 parcela)',
      'Chat Isabella ilimitado',
      'Analytics básico',
      'Publicar contenido',
      'Marketplace: vender assets',
      'UTAMV: 2 cursos gratis/mes'
    ],
    limits: {
      xrMinutes: 120,
      storageGB: 10,
      iaRequests: 50,
      commission: 30
    }
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 24.99,
    color: 'from-amber-400 to-yellow-600',
    icon: Star,
    badge: 'Oro',
    popular: true,
    benefits: [
      'Todo de Pioneer +',
      'DreamSpaces: 5 parcelas',
      'Editor XR completo',
      'KAOS Audio Pro',
      'Analytics avanzado',
      'Prioridad en gobernanza',
      'UTAMV: 5 cursos gratis/mes',
      'Soporte prioritario'
    ],
    limits: {
      xrMinutes: 500,
      storageGB: 50,
      iaRequests: 200,
      commission: 25
    }
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 79.99,
    color: 'from-purple-500 to-violet-600',
    icon: Diamond,
    badge: 'Platino',
    benefits: [
      'Todo de Gold +',
      'DreamSpaces: 20 parcelas',
      'Render 4D prioritario',
      'API Isabella empresarial',
      'White-label parcial',
      'Eventos exclusivos',
      'UTAMV: Acceso completo',
      'Auditoría BookPI incluida',
      'Voto doble en DAO'
    ],
    limits: {
      xrMinutes: 2000,
      storageGB: 200,
      iaRequests: 1000,
      commission: 18
    }
  },
  {
    id: 'fundador500',
    name: 'Fundador 500',
    price: 499.99,
    color: 'from-primary to-secondary',
    icon: Crown,
    badge: 'Fundador',
    exclusive: true,
    remaining: 127,
    benefits: [
      'Todo de Platinum +',
      'NFT Soulbound exclusivo',
      'DreamSpaces: ILIMITADOS',
      'Revenue share 5% de fees',
      'Consejo Fundador DAO',
      'Acceso código fuente (audit)',
      'Línea directa con desarrollo',
      'Nombre en Hall of Fame',
      'Certificado blockchain MSR',
      'Membresía vitalicia'
    ],
    limits: {
      xrMinutes: -1, // Unlimited
      storageGB: 1000,
      iaRequests: -1,
      commission: 10
    }
  }
];

const MembershipSystem = () => {
  const [selectedTier, setSelectedTier] = useState('gold');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const getPrice = (tier: typeof membershipTiers[0]) => {
    if (tier.price === 0) return 'Gratis';
    const price = billingCycle === 'annual' ? tier.price * 0.8 : tier.price;
    return `$${price.toFixed(2)}`;
  };

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
          <Crown className="w-10 h-10 text-primary" />
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Membresías TAMV
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Sistema de membresías escalonadas con beneficios exclusivos y acceso a todos los sistemas del ecosistema TAMV
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card text-muted-foreground'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              billingCycle === 'annual' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card text-muted-foreground'
            }`}
          >
            Anual
            <Badge variant="secondary" className="text-xs">-20%</Badge>
          </button>
        </div>
      </motion.div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {membershipTiers.map((tier, i) => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className={`relative h-full cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/20 scale-105' 
                    : 'hover:scale-102'
                } ${tier.exclusive ? 'border-2 border-secondary' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Más Popular
                    </Badge>
                  </div>
                )}
                
                {tier.exclusive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white animate-pulse">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {tier.remaining} restantes
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto">
                    {tier.badge}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-black">{getPrice(tier)}</span>
                    {tier.price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /{billingCycle === 'annual' ? 'año' : 'mes'}
                      </span>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">XR Min/mes</span>
                      <span className={tier.limits.xrMinutes === -1 ? 'text-primary font-bold' : ''}>
                        {tier.limits.xrMinutes === -1 ? '∞' : tier.limits.xrMinutes}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Storage</span>
                      <span>{tier.limits.storageGB} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comisión</span>
                      <span className="text-primary">{tier.limits.commission}%</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    {tier.benefits.slice(0, 5).map((benefit, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs">
                        <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                    {tier.benefits.length > 5 && (
                      <span className="text-xs text-primary">
                        +{tier.benefits.length - 5} más...
                      </span>
                    )}
                  </div>

                  <Button 
                    className={`w-full ${tier.exclusive 
                      ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' 
                      : ''}`}
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    {tier.price === 0 ? 'Comenzar Gratis' : 'Suscribirse'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Split Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Distribución de Ingresos 20/30/50</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-black text-emerald-500">20%</div>
                <div className="text-sm text-muted-foreground">Protocolo Fénix</div>
                <div className="text-xs text-muted-foreground/60">Becas & Justicia</div>
                <Progress value={20} className="h-1 mt-2" />
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-black text-blue-500">30%</div>
                <div className="text-sm text-muted-foreground">Infraestructura</div>
                <div className="text-xs text-muted-foreground/60">Servidores & Seguridad</div>
                <Progress value={30} className="h-1 mt-2" />
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="text-2xl font-black text-primary">50%</div>
                <div className="text-sm text-muted-foreground">Reserva Estratégica</div>
                <div className="text-xs text-muted-foreground/60">Expansión & I+D</div>
                <Progress value={50} className="h-1 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MembershipSystem;

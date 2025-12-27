import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Eye, EyeOff, Lock, CheckCircle, XCircle,
  Fingerprint, QrCode, Key, FileText, Globe, Clock,
  AlertTriangle, Verified, BadgeCheck, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IdentityClaim {
  id: string;
  type: string;
  value: string;
  verified: boolean;
  created_at: string;
}

interface ConsentEntry {
  id: string;
  consent_type: string;
  granted: boolean;
  purpose: string | null;
  data_categories: string[] | null;
  expires_at: string | null;
}

const IdentityPanel = () => {
  const [profile, setProfile] = useState<any>(null);
  const [claims, setClaims] = useState<IdentityClaim[]>([]);
  const [consents, setConsents] = useState<ConsentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const verificationLevel = profile?.verification_level || 0;
  const quantumId = profile?.quantum_id || 'QID-PENDING';

  useEffect(() => {
    loadIdentityData();
  }, []);

  const loadIdentityData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        const { data: consentData } = await supabase
          .from('consent_entries')
          .select('*')
          .eq('user_id', user.id);
        
        setConsents(consentData || []);
      }

      // Demo claims
      setClaims([
        { id: '1', type: 'email', value: 'user@tamv.online', verified: true, created_at: new Date().toISOString() },
        { id: '2', type: 'phone', value: '+52 ***-***-1234', verified: true, created_at: new Date().toISOString() },
        { id: '3', type: 'identity_document', value: 'INE Verificada', verified: false, created_at: new Date().toISOString() },
      ]);

    } catch (error) {
      console.error('Error loading identity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsentToggle = async (consentId: string, newValue: boolean) => {
    try {
      const { error } = await supabase
        .from('consent_entries')
        .update({ granted: newValue, updated_at: new Date().toISOString() })
        .eq('id', consentId);

      if (error) throw error;

      setConsents(prev => 
        prev.map(c => c.id === consentId ? { ...c, granted: newValue } : c)
      );

      toast({
        title: newValue ? "Consentimiento Otorgado" : "Consentimiento Revocado",
        description: "Tus preferencias han sido actualizadas",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el consentimiento",
        variant: "destructive"
      });
    }
  };

  const getVerificationBadge = (level: number) => {
    if (level >= 3) return { text: 'Verificado PQC', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (level >= 2) return { text: 'Verificado', color: 'bg-primary/20 text-primary border-primary/30' };
    if (level >= 1) return { text: 'Básico', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { text: 'Sin Verificar', color: 'bg-muted text-muted-foreground' };
  };

  const verificationBadge = getVerificationBadge(verificationLevel);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-dreamweave to-primary">
            <Fingerprint className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Identidad ID-NVIDA</h1>
            <p className="text-muted-foreground">Gestión de Identidad Digital Soberana</p>
          </div>
        </div>

        {/* Identity Card */}
        <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-16 h-16 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-card border-2 border-primary">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <Badge className={`mt-4 ${verificationBadge.color}`}>
                  <BadgeCheck className="w-3 h-3 mr-1" />
                  {verificationBadge.text}
                </Badge>
              </div>

              {/* Identity Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre Completo</p>
                  <p className="text-2xl font-bold text-foreground">
                    {profile?.full_name || 'Usuario TAMV'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantum ID</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-primary">{quantumId}</code>
                      <Button variant="ghost" size="sm" onClick={() => setShowQR(!showQR)}>
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nivel de Verificación</p>
                    <div className="flex items-center gap-2">
                      <Progress value={verificationLevel * 33.33} className="w-20 h-2" />
                      <span className="text-sm text-foreground">{verificationLevel}/3</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Badge className="bg-muted">
                    <Globe className="w-3 h-3 mr-1" />
                    Federación LATAM
                  </Badge>
                  <Badge className="bg-muted">
                    <Lock className="w-3 h-3 mr-1" />
                    Cifrado PQC
                  </Badge>
                  <Badge className="bg-muted">
                    <Key className="w-3 h-3 mr-1" />
                    Kyber-1024
                  </Badge>
                </div>
              </div>

              {/* QR Code Section */}
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-white rounded-xl"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center rounded-lg">
                    <QrCode className="w-24 h-24 text-background" />
                  </div>
                  <p className="text-xs text-center mt-2 text-foreground">Escanear para verificar</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="claims" className="w-full">
          <TabsList className="bg-muted/50 mb-6">
            <TabsTrigger value="claims">Claims de Identidad</TabsTrigger>
            <TabsTrigger value="consents">Consentimientos</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="verification">Verificación</TabsTrigger>
          </TabsList>

          <TabsContent value="claims">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Claims de Identidad Verificables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claims.map((claim, index) => (
                    <motion.div
                      key={claim.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${claim.verified ? 'bg-green-500/5 border-green-500/30' : 'bg-muted/20 border-border/50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${claim.verified ? 'bg-green-500/20' : 'bg-muted'}`}>
                            {claim.verified ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Clock className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground capitalize">{claim.type.replace('_', ' ')}</p>
                            <p className="text-sm text-muted-foreground">{claim.value}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={claim.verified ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}>
                            {claim.verified ? 'Verificado' : 'Pendiente'}
                          </Badge>
                          {!claim.verified && (
                            <Button variant="outline" size="sm">
                              Verificar
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button className="w-full mt-6" variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Agregar Nuevo Claim
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consents">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Gestión de Consentimientos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'analytics', type: 'Analíticas de uso', purpose: 'Mejorar la experiencia del usuario', granted: true },
                    { id: 'marketing', type: 'Comunicaciones de marketing', purpose: 'Recibir noticias y ofertas del ecosistema', granted: false },
                    { id: 'ai_training', type: 'Entrenamiento de IA', purpose: 'Mejorar los modelos de Isabella AI', granted: true },
                    { id: 'sharing', type: 'Compartir datos federados', purpose: 'Interoperabilidad entre nodos TAMV', granted: true },
                  ].map((consent, index) => (
                    <motion.div
                      key={consent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${consent.granted ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/10 border-border/30'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{consent.type}</p>
                          <p className="text-sm text-muted-foreground">{consent.purpose}</p>
                        </div>
                        <Switch
                          checked={consent.granted}
                          onCheckedChange={(value) => {
                            // Simular actualización local
                            toast({
                              title: value ? "Consentimiento Otorgado" : "Consentimiento Revocado",
                              description: `${consent.type}: ${value ? 'Activado' : 'Desactivado'}`
                            });
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="font-medium text-destructive">Revocar Todo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Esto revocará todos los consentimientos y limitará la funcionalidad de la plataforma.
                  </p>
                  <Button variant="destructive" size="sm">
                    Revocar Todos los Consentimientos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Configuración de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="w-6 h-6 text-primary" />
                      <h3 className="font-bold text-foreground">Cifrado Post-Cuántico</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Tu identidad está protegida con Kyber-1024, resistente a computación cuántica.
                    </p>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-secondary" />
                      <h3 className="font-bold text-foreground">Autenticación 2FA</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Añade una capa extra de seguridad con autenticación de dos factores.
                    </p>
                    <Button variant="outline" size="sm">
                      Configurar 2FA
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-muted/20 border border-border/30">
                  <h3 className="font-bold text-foreground mb-4">Sesiones Activas</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Este dispositivo</p>
                          <p className="text-xs text-muted-foreground">Chrome · México · Ahora</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Activa</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Verified className="w-5 h-5 text-primary" />
                  Proceso de Verificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { level: 1, name: 'Verificación Básica', desc: 'Email y teléfono verificados', completed: verificationLevel >= 1 },
                    { level: 2, name: 'Verificación Estándar', desc: 'Documento de identidad', completed: verificationLevel >= 2 },
                    { level: 3, name: 'Verificación PQC', desc: 'Biometría y firma cuántica', completed: verificationLevel >= 3 },
                  ].map((step, index) => (
                    <motion.div
                      key={step.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border-2 ${step.completed ? 'bg-green-500/5 border-green-500/30' : 'bg-muted/10 border-border/30'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${step.completed ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {step.completed ? <CheckCircle className="w-6 h-6" /> : step.level}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{step.name}</p>
                            <p className="text-sm text-muted-foreground">{step.desc}</p>
                          </div>
                        </div>
                        {step.completed ? (
                          <Badge className="bg-green-500/20 text-green-400">Completado</Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default IdentityPanel;

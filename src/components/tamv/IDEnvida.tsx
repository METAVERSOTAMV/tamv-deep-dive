import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Fingerprint, Shield, Eye, Check, Lock, Scan,
  User, Camera, Mic, FileText, Star, Award,
  Key, QrCode, Smartphone, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IdentityVerification {
  type: string;
  status: 'verified' | 'pending' | 'required';
  lastVerified?: string;
  icon: React.ReactNode;
}

const IDEnvida = () => {
  const [verificationLevel, setVerificationLevel] = useState(85);
  const [isScanning, setIsScanning] = useState(false);
  const [quantumId, setQuantumId] = useState('');

  useEffect(() => {
    // Generar ID cuántico único
    const id = `TAMV-ID-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setQuantumId(id);
  }, []);

  const verifications: IdentityVerification[] = [
    { type: 'Huella Biométrica', status: 'verified', lastVerified: 'Hace 2 días', icon: <Fingerprint className="w-5 h-5" /> },
    { type: 'Reconocimiento Facial', status: 'verified', lastVerified: 'Hace 5 horas', icon: <Eye className="w-5 h-5" /> },
    { type: 'Voz Emocional', status: 'pending', icon: <Mic className="w-5 h-5" /> },
    { type: 'Documento Oficial', status: 'verified', lastVerified: 'Hace 30 días', icon: <FileText className="w-5 h-5" /> },
    { type: 'Dispositivo Confiable', status: 'verified', lastVerified: 'Ahora', icon: <Smartphone className="w-5 h-5" /> },
    { type: 'Ubicación Verificada', status: 'required', icon: <Globe className="w-5 h-5" /> },
  ];

  const reputation = {
    score: 9.7,
    transactions: 1247,
    creations: 89,
    contributions: 456,
    badges: ['Pionero TAMV', 'Creador Elite', 'Guardian Verificado']
  };

  const startBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="min-h-screen bg-quantum p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-dreamweave/10">
            <Fingerprint className="w-8 h-8 text-dreamweave" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-quantum">ID-ENVIDA™</h1>
            <p className="text-muted-foreground">Identidad Digital Soberana · Inclonable y Emocional</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Identity Card */}
        <Card className="bg-gradient-to-br from-card via-card to-primary/10 border-primary/30">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 border-4 border-primary">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    AV
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full">
                  <Check className="w-4 h-4 text-background" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-4">Anubis Villaseñor</h2>
              <p className="text-muted-foreground">Creador & Custodio TAMV</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">ID Cuántico</label>
                <div className="font-mono text-sm text-foreground bg-background/30 p-2 rounded mt-1 break-all">
                  {quantumId}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Nivel de Verificación</span>
                  <span className="text-foreground font-bold">{verificationLevel}%</span>
                </div>
                <Progress value={verificationLevel} className="h-2" />
              </div>

              <div className="flex gap-2 flex-wrap">
                {reputation.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="border-anubis text-anubis">
                    <Star className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verifications */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Verificaciones de Identidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {verifications.map((verification) => (
              <div
                key={verification.type}
                className="flex items-center justify-between p-3 rounded-lg bg-background/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    verification.status === 'verified' 
                      ? 'bg-green-500/10 text-green-400'
                      : verification.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {verification.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{verification.type}</div>
                    {verification.lastVerified && (
                      <div className="text-xs text-muted-foreground">{verification.lastVerified}</div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={
                  verification.status === 'verified' 
                    ? 'border-green-500 text-green-400'
                    : verification.status === 'pending'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-red-500 text-red-400'
                }>
                  {verification.status === 'verified' ? 'Verificado' : 
                   verification.status === 'pending' ? 'Pendiente' : 'Requerido'}
                </Badge>
              </div>
            ))}

            <Button 
              className="w-full mt-4" 
              onClick={startBiometricScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                  Escaneando...
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Iniciar Verificación Biométrica
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Reputation */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-anubis" />
              Reputación TAMV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-anubis mb-2">
                {reputation.score}
              </div>
              <p className="text-muted-foreground">Puntuación de Confianza</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-background/30 rounded-lg">
                <div className="text-xl font-bold text-foreground">{reputation.transactions}</div>
                <div className="text-xs text-muted-foreground">Transacciones</div>
              </div>
              <div className="text-center p-3 bg-background/30 rounded-lg">
                <div className="text-xl font-bold text-foreground">{reputation.creations}</div>
                <div className="text-xs text-muted-foreground">Creaciones</div>
              </div>
              <div className="text-center p-3 bg-background/30 rounded-lg">
                <div className="text-xl font-bold text-foreground">{reputation.contributions}</div>
                <div className="text-xs text-muted-foreground">Contribuciones</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Clave Cuántica</span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400">Activa</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">QR de Identidad</span>
                </div>
                <Button size="sm" variant="outline">Generar</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Avatar 3D</span>
                </div>
                <Button size="sm" variant="outline">Crear</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IDEnvida;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Shield, Link2, FileCheck, Award, 
  Hash, Calendar, User, Globe, Download,
  CheckCircle, Clock, AlertCircle, Search, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IPRegistration {
  id: string;
  title: string;
  type: 'obra' | 'invento' | 'marca' | 'diseño' | 'software';
  author: string;
  status: 'pending' | 'verified' | 'anchored' | 'certified';
  doi?: string;
  msrHash?: string;
  createdAt: Date;
  verifiedAt?: Date;
}

const registrationTypes = [
  { id: 'obra', name: 'Obra Literaria/Artística', icon: BookOpen },
  { id: 'invento', name: 'Invención/Patente', icon: Shield },
  { id: 'marca', name: 'Marca Registrada', icon: Award },
  { id: 'diseño', name: 'Diseño Industrial', icon: Globe },
  { id: 'software', name: 'Software/Código', icon: FileCheck }
];

const BookPIRegistry = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [selectedType, setSelectedType] = useState('obra');
  const [registrationStep, setRegistrationStep] = useState(1);

  const mockRegistrations: IPRegistration[] = [
    {
      id: 'PI-2025-001',
      title: 'Isabella AI: Motor de Inferencia Emocional',
      type: 'invento',
      author: 'EOCT',
      status: 'certified',
      doi: '10.5281/tamv.2025.001',
      msrHash: '0x7a3f9c2d1e5b8a4f...',
      createdAt: new Date('2025-01-01'),
      verifiedAt: new Date('2025-01-05')
    },
    {
      id: 'PI-2025-002',
      title: 'Protocolo DEKATEOTL v1.0',
      type: 'software',
      author: 'EOCT',
      status: 'anchored',
      msrHash: '0x2b1e5f8a9d4c7b3e...',
      createdAt: new Date('2025-01-10')
    },
    {
      id: 'PI-2025-003',
      title: 'DreamSpaces: Sistema de Mundos XR',
      type: 'obra',
      author: 'TAMV Labs',
      status: 'verified',
      createdAt: new Date('2025-01-15')
    }
  ];

  const getStatusBadge = (status: IPRegistration['status']) => {
    const configs = {
      pending: { color: 'bg-yellow-500', icon: Clock, text: 'Pendiente' },
      verified: { color: 'bg-blue-500', icon: CheckCircle, text: 'Verificado' },
      anchored: { color: 'bg-purple-500', icon: Link2, text: 'Anclado MSR' },
      certified: { color: 'bg-emerald-500', icon: Award, text: 'Certificado' }
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
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
          <BookOpen className="w-10 h-10 text-secondary" />
          <h2 className="text-4xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            BookPI Registry
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema de registro de propiedad intelectual inmutable con anclaje blockchain MSR, 
          generación de DOI y certificados digitales verificables
        </p>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="register">
            <Plus className="w-4 h-4 mr-2" />
            Registrar
          </TabsTrigger>
          <TabsTrigger value="my-registrations">
            <FileCheck className="w-4 h-4 mr-2" />
            Mis Registros
          </TabsTrigger>
          <TabsTrigger value="verify">
            <Search className="w-4 h-4 mr-2" />
            Verificar
          </TabsTrigger>
        </TabsList>

        {/* Register Tab */}
        <TabsContent value="register" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Nuevo Registro de Propiedad Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {['Tipo', 'Datos', 'Evidencia', 'Anclaje', 'Certificado'].map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i + 1 <= registrationStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    {i < 4 && (
                      <div className={`w-12 md:w-20 h-1 ${
                        i + 1 < registrationStep ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Type Selection */}
              {registrationStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Selecciona el tipo de registro</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {registrationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-4 rounded-lg border-2 transition-colors text-center ${
                            selectedType === type.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${
                            selectedType === type.id ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <span className="text-sm font-medium">{type.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Data Entry */}
              {registrationStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información de la obra</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Título de la obra</label>
                      <Input placeholder="Ingresa el título completo" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Descripción</label>
                      <Textarea placeholder="Describe tu obra detalladamente" rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Autor/Titular</label>
                        <Input placeholder="Nombre del autor" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Fecha de creación</label>
                        <Input type="date" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Evidence */}
              {registrationStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subir evidencia</h3>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <FileCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                    <Button variant="outline">Seleccionar archivos</Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      PDF, imágenes, código fuente, documentos. Máximo 50MB
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Los archivos se cifran con SHA3-512 antes del anclaje</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Blockchain Anchor */}
              {registrationStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Anclaje Blockchain MSR</h3>
                  <Card className="bg-background/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Link2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">Anclando a MSR Chain...</div>
                          <div className="text-sm text-muted-foreground">Generando hash inmutable</div>
                        </div>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="font-mono text-xs bg-card p-3 rounded">
                        Hash: 0x{crypto.randomUUID().replace(/-/g, '').slice(0, 40)}...
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 5: Certificate */}
              {registrationStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Certificado Digital</h3>
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30">
                    <CardContent className="p-6 text-center">
                      <Award className="w-16 h-16 mx-auto text-primary mb-4" />
                      <h4 className="text-xl font-bold mb-2">¡Registro Completado!</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-center gap-2">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span>DOI: 10.5281/tamv.2025.xxx</span>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Fecha: {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center mt-6">
                        <Button>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar Certificado
                        </Button>
                        <Button variant="outline">Ver en Blockchain</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setRegistrationStep(Math.max(1, registrationStep - 1))}
                  disabled={registrationStep === 1}
                >
                  Anterior
                </Button>
                <Button 
                  onClick={() => setRegistrationStep(Math.min(5, registrationStep + 1))}
                  disabled={registrationStep === 5}
                >
                  {registrationStep === 4 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Registrations Tab */}
        <TabsContent value="my-registrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Registros de PI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRegistrations.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{reg.id}</span>
                          {getStatusBadge(reg.status)}
                        </div>
                        <h4 className="font-semibold">{reg.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {reg.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {reg.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        {reg.doi && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Globe className="w-3 h-3" />
                            DOI: {reg.doi}
                          </div>
                        )}
                        {reg.msrHash && (
                          <div className="font-mono text-xs text-muted-foreground">
                            MSR: {reg.msrHash}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify Tab */}
        <TabsContent value="verify" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Verificar Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="DOI, Hash o ID de registro" className="flex-1" />
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Verificar
                </Button>
              </div>
              <div className="p-8 bg-muted/50 rounded-lg text-center">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Ingresa un identificador para verificar la autenticidad del registro
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookPIRegistry;

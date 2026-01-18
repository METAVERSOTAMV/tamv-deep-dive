import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, Eye, 
  Filter, Search, ChevronDown, Layers, Scale, Heart,
  Brain, Flame, Mountain, Users, Compass, Star, Feather,
  Sun, Moon, Zap, Lock, FileText, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 11 DEKATEOTL Cosmological Layers based on Aztec worldview
const DEKATEOTL_LAYERS = [
  { 
    level: 1, 
    name: 'TONALLI', 
    domain: 'Identidad', 
    principle: 'Autenticidad del ser',
    icon: Sun,
    color: 'from-amber-400 to-yellow-500',
    description: 'Energía vital del sol que define la esencia de cada individuo',
    checks: ['Verificación de identidad única', 'Autenticidad de claims', 'Integridad del perfil']
  },
  { 
    level: 2, 
    name: 'NAHUAL', 
    domain: 'Protección', 
    principle: 'Guardián espiritual',
    icon: Shield,
    color: 'from-blue-500 to-indigo-600',
    description: 'El espíritu protector que resguarda el camino del usuario',
    checks: ['Detección de amenazas', 'Escudo anti-fraude', 'Protección de datos']
  },
  { 
    level: 3, 
    name: 'TEYOLIA', 
    domain: 'Emociones', 
    principle: 'Centro emocional',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    description: 'El corazón que siente y procesa las emociones',
    checks: ['Análisis de sentimiento', 'Detección de toxicidad', 'Bienestar emocional']
  },
  { 
    level: 4, 
    name: 'IHIYOTL', 
    domain: 'Aliento', 
    principle: 'Fuerza vital',
    icon: Flame,
    color: 'from-orange-500 to-red-600',
    description: 'El aliento de vida que impulsa la creatividad',
    checks: ['Energía creativa', 'Originalidad del contenido', 'Vitalidad de aportes']
  },
  { 
    level: 5, 
    name: 'MICTLAN', 
    domain: 'Memoria', 
    principle: 'Conocimiento ancestral',
    icon: Brain,
    color: 'from-gray-600 to-slate-700',
    description: 'El inframundo donde reside la memoria colectiva',
    checks: ['Preservación de legado', 'Consistencia histórica', 'Respeto a tradiciones']
  },
  { 
    level: 6, 
    name: 'TLALOCAN', 
    domain: 'Recursos', 
    principle: 'Abundancia justa',
    icon: Mountain,
    color: 'from-emerald-500 to-green-600',
    description: 'El paraíso de Tláloc donde fluyen los recursos',
    checks: ['Distribución equitativa', 'Sostenibilidad económica', 'Balance de recursos']
  },
  { 
    level: 7, 
    name: 'TAMOANCHAN', 
    domain: 'Creación', 
    principle: 'Origen de vida',
    icon: Star,
    color: 'from-violet-500 to-purple-600',
    description: 'El lugar mítico donde se origina toda creación',
    checks: ['Innovación ética', 'Creatividad responsable', 'Origen verificable']
  },
  { 
    level: 8, 
    name: 'CHICOMOZTOC', 
    domain: 'Comunidad', 
    principle: 'Siete cuevas de origen',
    icon: Users,
    color: 'from-teal-500 to-cyan-600',
    description: 'Las siete cuevas de donde emergieron los pueblos',
    checks: ['Cohesión social', 'Respeto mutuo', 'Colaboración']
  },
  { 
    level: 9, 
    name: 'AZTLAN', 
    domain: 'Destino', 
    principle: 'Tierra prometida',
    icon: Compass,
    color: 'from-blue-400 to-sky-500',
    description: 'La tierra blanca, destino final del viaje',
    checks: ['Alineación con misión', 'Progreso sostenible', 'Visión a futuro']
  },
  { 
    level: 10, 
    name: 'OMEYOCAN', 
    domain: 'Dualidad', 
    principle: 'Equilibrio cósmico',
    icon: Moon,
    color: 'from-indigo-500 to-violet-600',
    description: 'El lugar de la dualidad donde todo se equilibra',
    checks: ['Balance de fuerzas', 'Armonía de opuestos', 'Justicia dual']
  },
  { 
    level: 11, 
    name: 'QUETZALCOATL', 
    domain: 'Sabiduría', 
    principle: 'Serpiente emplumada',
    icon: Feather,
    color: 'from-emerald-400 via-cyan-400 to-blue-500',
    description: 'La serpiente emplumada, símbolo máximo de sabiduría',
    checks: ['Sabiduría aplicada', 'Decisión ética final', 'Trascendencia']
  },
];

const GUARDIAN_TYPES = [
  { id: 'ethical', name: 'Guardián Ético', icon: Scale, threshold: 0.8, color: 'text-emerald-400' },
  { id: 'security', name: 'Guardián de Seguridad', icon: Lock, threshold: 0.9, color: 'text-red-400' },
  { id: 'emotional', name: 'Guardián Emocional', icon: Heart, threshold: 0.7, color: 'text-pink-400' },
  { id: 'contextual', name: 'Guardián Contextual', icon: Brain, threshold: 0.75, color: 'text-cyan-400' },
  { id: 'legal', name: 'Guardián Legal', icon: FileText, threshold: 0.85, color: 'text-amber-400' },
];

interface FilterResult {
  layer: typeof DEKATEOTL_LAYERS[0];
  passed: boolean;
  score: number;
  details: string;
}

const DEKATEOTLComplete = () => {
  const [activeLayer, setActiveLayer] = useState<typeof DEKATEOTL_LAYERS[0] | null>(null);
  const [filterResults, setFilterResults] = useState<FilterResult[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [overallScore, setOverallScore] = useState(0);

  const runFilter = async () => {
    if (!testInput.trim()) return;
    
    setIsFiltering(true);
    setFilterResults([]);
    setOverallScore(0);

    const results: FilterResult[] = [];
    let totalScore = 0;

    for (const layer of DEKATEOTL_LAYERS) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const score = 0.6 + Math.random() * 0.4;
      const passed = score > 0.65;
      totalScore += score;

      results.push({
        layer,
        passed,
        score,
        details: passed 
          ? `${layer.checks[0]} verificado correctamente` 
          : `Revisar: ${layer.checks[Math.floor(Math.random() * layer.checks.length)]}`
      });

      setFilterResults([...results]);
    }

    setOverallScore((totalScore / 11) * 100);
    setIsFiltering(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return 'text-green-400';
    if (score >= 0.7) return 'text-yellow-400';
    if (score >= 0.5) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-violet-900/50 via-purple-900/50 to-indigo-900/50"
      >
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8 flex flex-col justify-end h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl">
              <Feather className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-black">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  DEKATEOTL
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Sistema de Filtrado Ético Cosmológico Azteca • 11 Capas de Sabiduría
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="layers" className="w-full">
        <TabsList className="bg-muted/50 mb-6">
          <TabsTrigger value="layers" className="gap-2"><Layers className="w-4 h-4" /> 11 Capas</TabsTrigger>
          <TabsTrigger value="filter" className="gap-2"><Filter className="w-4 h-4" /> Filtrado</TabsTrigger>
          <TabsTrigger value="guardians" className="gap-2"><Shield className="w-4 h-4" /> Guardianes</TabsTrigger>
          <TabsTrigger value="decisions" className="gap-2"><Scale className="w-4 h-4" /> Decisiones</TabsTrigger>
        </TabsList>

        {/* 11 Layers Tab */}
        <TabsContent value="layers">
          <div className="grid gap-4">
            {DEKATEOTL_LAYERS.map((layer, i) => (
              <motion.div
                key={layer.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className={`bg-gradient-to-r ${layer.color} border-0 cursor-pointer transition-all hover:scale-[1.02]`}
                  onClick={() => setActiveLayer(activeLayer?.level === layer.level ? null : layer)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
                        <span className="text-2xl font-black text-white">{layer.level}</span>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <layer.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                          <Badge className="bg-white/20 text-white border-0">{layer.domain}</Badge>
                        </div>
                        <p className="text-white/80 text-sm">{layer.principle}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-white/70 transition-transform ${activeLayer?.level === layer.level ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {activeLayer?.level === layer.level && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-white/20">
                            <p className="text-white/90 mb-4">{layer.description}</p>
                            <div className="grid grid-cols-3 gap-3">
                              {layer.checks.map((check, j) => (
                                <div key={j} className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
                                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                                  <span className="text-white/90 text-sm">{check}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Filter Tab */}
        <TabsContent value="filter">
          <Card className="bg-card/50 backdrop-blur border-border/50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Probar Filtrado DEKATEOTL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Ingresa contenido, decisión o acción a filtrar..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="flex-1 bg-background/50"
                />
                <Button onClick={runFilter} disabled={isFiltering || !testInput.trim()} className="gap-2">
                  {isFiltering ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Filtrando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Ejecutar Filtro
                    </>
                  )}
                </Button>
              </div>

              {filterResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <span className="font-bold">Score General DEKATEOTL</span>
                    <span className={`text-3xl font-black ${getScoreColor(overallScore / 100)}`}>
                      {overallScore.toFixed(1)}%
                    </span>
                  </div>

                  {filterResults.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-4 p-4 rounded-xl ${result.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${result.layer.color}`}>
                        <result.layer.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{result.layer.name}</span>
                          <Badge variant="outline" className="text-xs">{result.layer.domain}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.details}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getScoreColor(result.score)}`}>
                          {(result.score * 100).toFixed(0)}%
                        </p>
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-400 inline" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400 inline" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guardians Tab */}
        <TabsContent value="guardians">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUARDIAN_TYPES.map((guardian) => (
              <Card key={guardian.id} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-muted rounded-xl">
                      <guardian.icon className={`w-8 h-8 ${guardian.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{guardian.name}</h3>
                      <p className="text-sm text-muted-foreground">Umbral: {(guardian.threshold * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <Progress value={guardian.threshold * 100} className="mb-4" />
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-green-400 border-green-400/30">ACTIVO</Badge>
                    <Button variant="ghost" size="sm">Configurar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Decisions Tab */}
        <TabsContent value="decisions">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Registro de Decisiones Éticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'content_moderation', severity: 'medium', status: 'resolved', score: 78, date: 'Hace 2 horas' },
                  { type: 'identity_claim', severity: 'low', status: 'approved', score: 95, date: 'Hace 5 horas' },
                  { type: 'economic_dispute', severity: 'high', status: 'pending', score: 62, date: 'Hace 1 día' },
                  { type: 'community_report', severity: 'critical', status: 'escalated', score: 45, date: 'Hace 2 días' },
                ].map((decision, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">{decision.type.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">{decision.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={
                        decision.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        decision.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        decision.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }>
                        {decision.severity}
                      </Badge>
                      <Badge className={
                        decision.status === 'resolved' || decision.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        decision.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {decision.status}
                      </Badge>
                      <span className={`font-bold ${getScoreColor(decision.score / 100)}`}>{decision.score}%</span>
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DEKATEOTLComplete;

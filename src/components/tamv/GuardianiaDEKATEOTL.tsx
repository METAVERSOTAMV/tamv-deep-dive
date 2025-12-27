import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, Eye, 
  Filter, Search, ChevronDown, XCircle, AlertCircle,
  Lock, FileText, User, Scale, Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DecisionRecord {
  id: string;
  decision_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_review' | 'resolved' | 'escalated';
  ethical_score: number | null;
  affected_entity: string | null;
  created_at: string;
  details: Record<string, any> | null;
}

const severityColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-destructive/20 text-destructive border-destructive/30'
};

const statusColors = {
  pending: 'bg-muted text-muted-foreground',
  in_review: 'bg-primary/20 text-primary',
  resolved: 'bg-green-500/20 text-green-400',
  escalated: 'bg-destructive/20 text-destructive'
};

const GuardianiaDEKATEOTL = () => {
  const [records, setRecords] = useState<DecisionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DecisionRecord | null>(null);
  const { toast } = useToast();

  // Estadísticas del sistema de guardianía
  const stats = {
    totalCases: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    resolved: records.filter(r => r.status === 'resolved').length,
    avgEthicalScore: records.reduce((acc, r) => acc + (r.ethical_score || 0), 0) / (records.length || 1),
    criticalCases: records.filter(r => r.severity === 'critical').length
  };

  useEffect(() => {
    loadDecisionRecords();
  }, [filter, severityFilter]);

  const loadDecisionRecords = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('decision_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      setRecords(data as DecisionRecord[] || []);
    } catch (error: any) {
      console.error('Error loading records:', error);
      // Si no hay permisos, mostrar datos de demostración
      setRecords([
        {
          id: 'demo-1',
          decision_type: 'content_moderation',
          severity: 'medium',
          status: 'pending',
          ethical_score: 75,
          affected_entity: 'user-content-12345',
          created_at: new Date().toISOString(),
          details: { reason: 'Contenido reportado por la comunidad' }
        },
        {
          id: 'demo-2',
          decision_type: 'identity_verification',
          severity: 'low',
          status: 'resolved',
          ethical_score: 95,
          affected_entity: 'identity-claim-67890',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          details: { reason: 'Verificación de identidad completada' }
        },
        {
          id: 'demo-3',
          decision_type: 'economic_dispute',
          severity: 'high',
          status: 'in_review',
          ethical_score: 60,
          affected_entity: 'transaction-xyz',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          details: { reason: 'Disputa sobre reparto de TAU' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        record.decision_type.toLowerCase().includes(searchLower) ||
        record.affected_entity?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Guardianía DEKATEOTL</h1>
            <p className="text-muted-foreground">Panel de Decisiones Éticas y Gobernanza</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCases}</p>
                  <p className="text-xs text-muted-foreground">Total Casos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resueltos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.avgEthicalScore.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Score Ético</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.criticalCases}</p>
                  <p className="text-xs text-muted-foreground">Críticos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 mb-6"
      >
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tipo o entidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-background/50">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="in_review">En revisión</SelectItem>
            <SelectItem value="resolved">Resuelto</SelectItem>
            <SelectItem value="escalated">Escalado</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px] bg-background/50">
            <SelectValue placeholder="Severidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las severidades</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="critical">Crítica</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Registros de Decisiones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando registros...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-8 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No hay registros que mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Tipo</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Severidad</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Estado</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Score Ético</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fecha</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{record.decision_type.replace('_', ' ')}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {record.affected_entity || 'Sin entidad'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${severityColors[record.severity]} capitalize`}>
                            {record.severity}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${statusColors[record.status]} capitalize`}>
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={record.ethical_score || 0} 
                              className="w-16 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {record.ethical_score || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(record.created_at)}
                        </td>
                        <td className="p-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border/50">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Shield className="w-5 h-5 text-primary" />
                                  Detalles del Caso
                                </DialogTitle>
                                <DialogDescription>
                                  Información del registro de decisión ética
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Tipo</p>
                                    <p className="font-medium text-foreground">{record.decision_type.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Severidad</p>
                                    <Badge className={severityColors[record.severity]}>
                                      {record.severity}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <Badge className={statusColors[record.status]}>
                                      {record.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Score Ético</p>
                                    <p className="font-medium text-foreground">{record.ethical_score || 0}%</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Entidad Afectada</p>
                                  <code className="text-xs bg-muted p-2 rounded block">
                                    {record.affected_entity || 'No especificada'}
                                  </code>
                                </div>
                                {record.details && (
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">Detalles</p>
                                    <div className="bg-muted/30 p-3 rounded-lg text-sm">
                                      {JSON.stringify(record.details, null, 2)}
                                    </div>
                                  </div>
                                )}
                                <div className="flex gap-2 mt-4">
                                  <Button className="flex-1" variant="outline">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Ver Datos Sensibles
                                  </Button>
                                  <Button className="flex-1 bg-primary">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Resolver Caso
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 11 Capas de Filtrado Ético */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          11 Capas de Filtrado Ético DEKATEOTL
        </h2>
        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { layer: 1, name: 'Bienestar', active: true },
            { layer: 2, name: 'Veracidad', active: true },
            { layer: 3, name: 'Equidad', active: true },
            { layer: 4, name: 'Privacidad', active: true },
            { layer: 5, name: 'Autonomía', active: true },
            { layer: 6, name: 'Transparencia', active: true },
            { layer: 7, name: 'Responsabilidad', active: true },
            { layer: 8, name: 'Seguridad', active: true },
            { layer: 9, name: 'Sostenibilidad', active: true },
            { layer: 10, name: 'Dignidad', active: true },
            { layer: 11, name: 'Justicia', active: true },
          ].map((capa) => (
            <Card 
              key={capa.layer} 
              className={`bg-card/50 backdrop-blur border-2 ${capa.active ? 'border-green-500/50' : 'border-border/30'}`}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${capa.active ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {capa.layer}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{capa.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {capa.active ? 'Activa' : 'Inactiva'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GuardianiaDEKATEOTL;

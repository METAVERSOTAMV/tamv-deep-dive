import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Edit, 
  Clock, User, Eye, RefreshCw, Loader2, ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface IsabellaEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  severity: string;
  content: string | null;
  metadata: unknown;
  requires_hitl: boolean;
  hitl_status: string;
  hitl_notes: string | null;
  created_at: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Stats {
  pending: number;
  approved: number;
  edited: number;
  blocked: number;
  total: number;
}

export default function Guardian() {
  const [events, setEvents] = useState<IsabellaEvent[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, edited: 0, blocked: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<IsabellaEvent | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadEvents();
      loadStats();
      setupRealtime();
    }
  }, [isAuthorized, activeTab]);

  const checkAuthorization = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    // Check if user has guardian or admin role
    const { data: guardianRole } = await supabase.rpc('has_role', {
      _user_id: session.user.id,
      _role: 'guardian'
    });

    const { data: adminRole } = await supabase.rpc('has_role', {
      _user_id: session.user.id,
      _role: 'admin'
    });

    if (!guardianRole && !adminRole) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('isabella_events')
        .select('*')
        .eq('requires_hitl', true)
        .order('created_at', { ascending: false })
        .limit(100);

      if (activeTab !== 'all') {
        query = query.eq('hitl_status', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents((data as unknown as IsabellaEvent[]) || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const { data } = await supabase
      .from('isabella_events')
      .select('hitl_status')
      .eq('requires_hitl', true);

    const newStats = { pending: 0, approved: 0, edited: 0, blocked: 0, total: data?.length || 0 };
    data?.forEach(e => {
      if (e.hitl_status === 'pending') newStats.pending++;
      if (e.hitl_status === 'approved') newStats.approved++;
      if (e.hitl_status === 'edited') newStats.edited++;
      if (e.hitl_status === 'blocked') newStats.blocked++;
    });
    setStats(newStats);
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('guardian-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'isabella_events' }, () => {
        loadEvents();
        loadStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const handleAction = async (action: 'APPROVE' | 'EDIT' | 'BLOCK') => {
    if (!selectedEvent) return;

    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hitl-resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: 'resolve',
          event_id: selectedEvent.id,
          hitl_action: action,
          notes: actionNotes || undefined,
          edited_content: action === 'EDIT' ? editedContent : undefined
        })
      });

      const result = await response.json();
      
      if (!result.success) throw new Error(result.error);

      toast({
        title: 'Acción completada',
        description: `Evento ${action.toLowerCase() === 'approve' ? 'aprobado' : action.toLowerCase() === 'edit' ? 'editado' : 'bloqueado'}`
      });

      setSelectedEvent(null);
      setActionNotes('');
      setEditedContent('');
      loadEvents();
      loadStats();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'blocked': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'edited': return <Edit className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
          <p className="text-muted-foreground mb-6">
            Esta consola está reservada para Guardianes y Administradores del ecosistema TAMV.
          </p>
          <Link to="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Consola de Guardián</h1>
              </div>
            </div>
            <Button variant="outline" onClick={() => { loadEvents(); loadStats(); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Aprobados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.edited}</div>
            <div className="text-sm text-muted-foreground">Editados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.blocked}</div>
            <div className="text-sm text-muted-foreground">Bloqueados</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="approved">Aprobados</TabsTrigger>
            <TabsTrigger value="blocked">Bloqueados</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay eventos en esta categoría</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className="p-4 hover:bg-card/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {getStatusIcon(event.hitl_status)}
                            <Badge variant="outline" className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                            <Badge variant="outline">{event.event_type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(event.created_at), { locale: es, addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground line-clamp-2">
                            {event.content || JSON.stringify(event.metadata).substring(0, 100)}
                          </p>
                          {event.profiles && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{event.profiles.username || event.profiles.full_name || 'Anónimo'}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Revisión de Evento HITL
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Event Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-2 font-mono text-xs">{selectedEvent.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="outline" className="ml-2">{selectedEvent.event_type}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Severidad:</span>
                  <Badge variant="outline" className={`ml-2 ${getSeverityColor(selectedEvent.severity)}`}>
                    {selectedEvent.severity}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="ml-2 capitalize">{selectedEvent.hitl_status}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Contenido</label>
                <Card className="p-3 bg-muted/50">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedEvent.content || 'Sin contenido textual'}
                  </p>
                </Card>
              </div>

              {/* Metadata */}
              {Object.keys(selectedEvent.metadata || {}).length > 0 && (
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Metadata</label>
                  <Card className="p-3 bg-muted/50">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}

              {/* Action Notes */}
              {selectedEvent.hitl_status === 'pending' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Notas (opcional)</label>
                    <Textarea
                      placeholder="Añade notas sobre tu decisión..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Contenido editado (solo para EDITAR)</label>
                    <Textarea
                      placeholder="Versión corregida del contenido..."
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {selectedEvent?.hitl_status === 'pending' && (
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => handleAction('BLOCK')}
                disabled={processing}
                className="flex-1 text-red-500 border-red-500/30 hover:bg-red-500/10"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Bloquear
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleAction('EDIT')}
                disabled={processing || !editedContent.trim()}
                className="flex-1 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button 
                onClick={() => handleAction('APPROVE')}
                disabled={processing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

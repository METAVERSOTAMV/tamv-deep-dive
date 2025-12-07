import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Shield, Check, AlertTriangle, Clock, 
  Hash, FileText, Download, Search, Filter,
  ChevronRight, Lock, Eye, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuditEvent {
  id: string;
  timestamp: string;
  type: 'TRANSACTION' | 'SECURITY' | 'ACCESS' | 'SYSTEM' | 'GOVERNANCE';
  action: string;
  actor: string;
  details: string;
  hash: string;
  verified: boolean;
  severity: 'info' | 'warning' | 'critical';
}

const BookPIPanel = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Generar eventos de auditoría simulados
    const mockEvents: AuditEvent[] = [
      {
        id: 'evt-001',
        timestamp: new Date().toISOString(),
        type: 'SECURITY',
        action: 'Anubis Sentinel Scan Complete',
        actor: 'system:sentinel',
        details: 'Full system security scan completed. 0 threats detected.',
        hash: 'sha512:a1b2c3d4e5f6...',
        verified: true,
        severity: 'info'
      },
      {
        id: 'evt-002',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: 'TRANSACTION',
        action: 'TAMV Credits Transfer',
        actor: 'user:anubis.creator',
        details: 'Transfer of 500 TC to DreamSpace rewards pool',
        hash: 'sha512:f6e5d4c3b2a1...',
        verified: true,
        severity: 'info'
      },
      {
        id: 'evt-003',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'GOVERNANCE',
        action: 'DAO Proposal Approved',
        actor: 'dao:hybrid-council',
        details: 'Proposal #127: New artist onboarding incentives approved',
        hash: 'sha512:1a2b3c4d5e6f...',
        verified: true,
        severity: 'info'
      },
      {
        id: 'evt-004',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'ACCESS',
        action: 'Isabella Core Access',
        actor: 'user:developer.lead',
        details: 'Authorized access to Isabella emotional processing module',
        hash: 'sha512:6f5e4d3c2b1a...',
        verified: true,
        severity: 'info'
      },
      {
        id: 'evt-005',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'SYSTEM',
        action: 'DreamSpace Created',
        actor: 'user:creator.mx',
        details: 'New XR environment "Nebula Gallery" instantiated',
        hash: 'sha512:b1a2c3d4e5f6...',
        verified: true,
        severity: 'info'
      },
    ];
    setEvents(mockEvents);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SECURITY': return 'bg-red-500/10 text-red-400 border-red-500/50';
      case 'TRANSACTION': return 'bg-green-500/10 text-green-400 border-green-500/50';
      case 'GOVERNANCE': return 'bg-purple-500/10 text-purple-400 border-purple-500/50';
      case 'ACCESS': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
      case 'SYSTEM': return 'bg-primary/10 text-primary border-primary/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const verifyHash = async (event: AuditEvent) => {
    setIsVerifying(true);
    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
  };

  const filteredEvents = events.filter(event => 
    event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.actor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-quantum p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-anubis/10">
            <BookOpen className="w-8 h-8 text-anubis" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-anubis">BookPI™</h1>
            <p className="text-muted-foreground">Sistema de Auditoría Inmutable TAMV</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Eventos Registrados', value: '1,247,892', icon: <Database className="w-5 h-5" /> },
          { label: 'Verificados', value: '100%', icon: <Check className="w-5 h-5" /> },
          { label: 'Integridad', value: 'SHA-512', icon: <Hash className="w-5 h-5" /> },
          { label: 'Última Auditoría', value: 'Hace 2min', icon: <Clock className="w-5 h-5" /> },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Registro de Auditoría</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar eventos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-background/50"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/30 ${
                        selectedEvent?.id === event.id ? 'border-primary bg-primary/5' : 'border-border/50'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <div>
                            <div className="font-semibold text-foreground">{event.action}</div>
                            <div className="text-sm text-muted-foreground mt-1">{event.details}</div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{new Date(event.timestamp).toLocaleString()}</span>
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {event.actor}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.verified && (
                            <div className="p-1 rounded-full bg-green-500/10">
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <div>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Detalles del Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEvent.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs text-muted-foreground">ID del Evento</label>
                      <div className="font-mono text-sm text-foreground">{selectedEvent.id}</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Timestamp</label>
                      <div className="text-sm text-foreground">
                        {new Date(selectedEvent.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Acción</label>
                      <div className="text-sm text-foreground">{selectedEvent.action}</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Actor</label>
                      <div className="text-sm text-foreground font-mono">{selectedEvent.actor}</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Hash Criptográfico</label>
                      <div className="text-xs text-foreground font-mono break-all bg-muted/30 p-2 rounded">
                        {selectedEvent.hash}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${selectedEvent.verified ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                          {selectedEvent.verified ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <span className="text-sm text-foreground">
                          {selectedEvent.verified ? 'Verificado' : 'Pendiente'}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => verifyHash(selectedEvent)}
                        disabled={isVerifying}
                      >
                        {isVerifying ? 'Verificando...' : 'Re-verificar'}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Selecciona un evento para ver sus detalles
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookPIPanel;

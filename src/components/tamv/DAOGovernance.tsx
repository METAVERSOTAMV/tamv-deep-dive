import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Vote, FileText, CheckCircle, XCircle, Clock,
  TrendingUp, AlertTriangle, Shield, Star, MessageSquare,
  ThumbsUp, ThumbsDown, Eye, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  deadline: string;
  category: 'economic' | 'governance' | 'technical' | 'social';
}

const DAOGovernance = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    setProposals([
      {
        id: 'prop-001',
        title: 'Reducir comisiones para artistas emergentes',
        description: 'Propuesta para reducir las comisiones del marketplace del 20% al 10% para creadores con menos de 100 ventas.',
        author: 'creator.mx',
        status: 'active',
        votesFor: 2847,
        votesAgainst: 892,
        quorum: 5000,
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
        category: 'economic'
      },
      {
        id: 'prop-002',
        title: 'Nuevo módulo de DreamSpaces educativos',
        description: 'Implementar espacios XR dedicados a educación con certificaciones TAMV.',
        author: 'anubis.villaseñor',
        status: 'passed',
        votesFor: 4521,
        votesAgainst: 234,
        quorum: 4000,
        deadline: new Date(Date.now() - 86400000).toISOString(),
        category: 'technical'
      },
      {
        id: 'prop-003',
        title: 'Programa de embajadores regionales',
        description: 'Crear red de embajadores TAMV en 50 países con incentivos en TC.',
        author: 'community.lead',
        status: 'active',
        votesFor: 1892,
        votesAgainst: 456,
        quorum: 3000,
        deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
        category: 'social'
      },
      {
        id: 'prop-004',
        title: 'Integración con blockchain Solana',
        description: 'Añadir soporte para NFTs en Solana además de la blockchain actual.',
        author: 'dev.blockchain',
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        quorum: 4500,
        deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
        category: 'technical'
      },
    ]);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'bg-green-500/10 text-green-400 border-green-500/50';
      case 'governance': return 'bg-purple-500/10 text-purple-400 border-purple-500/50';
      case 'technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
      case 'social': return 'bg-orange-500/10 text-orange-400 border-orange-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/10 text-primary border-primary/50">En Votación</Badge>;
      case 'passed':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/50">Aprobada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/50">Rechazada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50">Pendiente</Badge>;
      default:
        return null;
    }
  };

  const councilMembers = [
    { name: 'Anubis Villaseñor', role: 'Creador & Custodio', votes: 1000 },
    { name: 'Isabella AI™', role: 'Guardiana Ética', votes: 500 },
    { name: 'Consejo Técnico', role: 'Desarrollo', votes: 750 },
    { name: 'Comunidad Elite', role: 'Representantes', votes: 1250 },
  ];

  return (
    <div className="min-h-screen bg-quantum p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-secondary/10">
            <Users className="w-8 h-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-quantum">DAO Híbrida TAMV™</h1>
            <p className="text-muted-foreground">Gobernanza Distribuida · Democracia Institucional con Veto Ético</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Propuestas Activas', value: '4', icon: <FileText className="w-5 h-5" /> },
          { label: 'Votantes Activos', value: '12,847', icon: <Users className="w-5 h-5" /> },
          { label: 'Propuestas Aprobadas', value: '127', icon: <CheckCircle className="w-5 h-5" /> },
          { label: 'Participación', value: '78%', icon: <TrendingUp className="w-5 h-5" /> },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
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
        {/* Proposals List */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Propuestas</CardTitle>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Nueva Propuesta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Activas</TabsTrigger>
                  <TabsTrigger value="passed">Aprobadas</TabsTrigger>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {proposals.filter(p => p.status === 'active' || p.status === 'pending').map((proposal) => {
                        const totalVotes = proposal.votesFor + proposal.votesAgainst;
                        const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 50;
                        
                        return (
                          <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                            onClick={() => setSelectedProposal(proposal)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                                    {proposal.category}
                                  </Badge>
                                  {getStatusBadge(proposal.status)}
                                </div>
                                <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {proposal.description}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            </div>

                            {proposal.status === 'active' && (
                              <>
                                <div className="flex gap-2 mb-2">
                                  <div className="flex-1 h-2 bg-green-500/20 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-500 transition-all"
                                      style={{ width: `${forPercentage}%` }}
                                    />
                                  </div>
                                  <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-red-500 transition-all"
                                      style={{ width: `${100 - forPercentage}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3 text-green-400" />
                                    {proposal.votesFor.toLocaleString()}
                                  </span>
                                  <span>Quórum: {Math.round((totalVotes / proposal.quorum) * 100)}%</span>
                                  <span className="flex items-center gap-1">
                                    <ThumbsDown className="w-3 h-3 text-red-400" />
                                    {proposal.votesAgainst.toLocaleString()}
                                  </span>
                                </div>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="passed">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {proposals.filter(p => p.status === 'passed').map((proposal) => (
                        <div key={proposal.id} className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{proposal.description}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="all">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {proposals.map((proposal) => (
                        <div key={proposal.id} className="p-4 rounded-lg border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(proposal.status)}
                            <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Council & Voting Power */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" />
                Mesa Directiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {councilMembers.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                  <div>
                    <div className="font-medium text-foreground">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <Badge variant="outline" className="border-anubis text-anubis">
                    <Star className="w-3 h-3 mr-1" />
                    {member.votes} votos
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-anubis" />
                Veto Ético
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Isabella AI™ y el Consejo tienen poder de veto sobre propuestas que:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  Comprometan la seguridad del ecosistema
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  Violen principios éticos fundamentales
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  Causen daño económico a usuarios
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  Discriminen o marginen comunidades
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DAOGovernance;

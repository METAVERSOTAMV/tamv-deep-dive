import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  Wallet, Clock, Star, Gift, Lock, Zap, BarChart3, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string | null;
  created_at: string;
  balance_before: number | null;
  balance_after: number | null;
}

const TAUEconomy = () => {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const { toast } = useToast();

  // Estadísticas simuladas
  const stats = {
    totalEarned: 5420,
    totalSpent: 2150,
    stakingRewards: 320,
    pendingRewards: 45,
    creatorRoyalties: 890,
    referralBonus: 120
  };

  useEffect(() => {
    loadTransactions();
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tamv_credits')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setBalance(profile.tamv_credits || 1000);
        }
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('tamv_credits_ledger')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setTransactions(data || []);
      } else {
        // Demo transactions
        setTransactions([
          {
            id: '1',
            transaction_type: 'reward',
            amount: 50,
            description: 'Recompensa por contribución',
            created_at: new Date().toISOString(),
            balance_before: 950,
            balance_after: 1000
          },
          {
            id: '2',
            transaction_type: 'staking',
            amount: 25,
            description: 'Interés de staking mensual',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            balance_before: 925,
            balance_after: 950
          },
          {
            id: '3',
            transaction_type: 'transfer',
            amount: -100,
            description: 'Compra en marketplace',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            balance_before: 1025,
            balance_after: 925
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferAddress) {
      toast({
        title: "Error",
        description: "Ingresa monto y dirección de destino",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount <= 0 || amount > balance) {
      toast({
        title: "Error",
        description: "Monto inválido o saldo insuficiente",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transferencia Iniciada",
      description: `Enviando ${amount} TAU a ${transferAddress.substring(0, 8)}...`,
    });

    // Simular transferencia
    setTimeout(() => {
      setBalance(prev => prev - amount);
      setTransferAmount('');
      setTransferAddress('');
      toast({
        title: "Transferencia Exitosa",
        description: `${amount} TAU enviados correctamente`,
      });
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'reward': return <Gift className="w-4 h-4 text-green-400" />;
      case 'staking': return <Lock className="w-4 h-4 text-primary" />;
      case 'transfer': return <ArrowUpRight className="w-4 h-4 text-yellow-400" />;
      case 'receive': return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      default: return <Coins className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-anubis to-sovereign">
            <Coins className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Economía TAU</h1>
            <p className="text-muted-foreground">Wallet y Gestión de Créditos TAMV</p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">{balance.toLocaleString()}</span>
                  <span className="text-2xl text-primary">TAU</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">+12.5% este mes</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Recibir
                </Button>
                <Button variant="outline" className="border-primary/50">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
                <Button variant="outline" className="border-anubis/50">
                  <Lock className="w-4 h-4 mr-2" />
                  Staking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        {[
          { label: 'Total Ganado', value: stats.totalEarned, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Total Gastado', value: stats.totalSpent, icon: TrendingDown, color: 'text-red-400' },
          { label: 'Staking Rewards', value: stats.stakingRewards, icon: Lock, color: 'text-primary' },
          { label: 'Pendientes', value: stats.pendingRewards, icon: Clock, color: 'text-yellow-400' },
          { label: 'Regalías', value: stats.creatorRoyalties, icon: Star, color: 'text-secondary' },
          { label: 'Referidos', value: stats.referralBonus, icon: Gift, color: 'text-anubis' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="bg-muted/50 mb-6">
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="transfer">Transferir</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Historial de Transacciones
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={loadTransactions}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Cargando transacciones...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No hay transacciones</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted/50">
                            {getTransactionIcon(tx.transaction_type)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground capitalize">
                              {tx.transaction_type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tx.description || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount} TAU
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(tx.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                  Enviar TAU
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Dirección de Destino</label>
                  <Input
                    placeholder="Ingresa la dirección del destinatario..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Monto (TAU)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="bg-background/50 pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      TAU
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Balance disponible: {balance.toLocaleString()} TAU
                  </p>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      onClick={() => setTransferAmount(String(Math.floor(balance * (percent / 100))))}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleTransfer}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Enviar TAU
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staking">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Staking de TAU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                      <h3 className="text-lg font-bold text-foreground mb-2">Pool Estándar</h3>
                      <p className="text-sm text-muted-foreground mb-4">Bloqueo de 30 días</p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-primary">5.2%</span>
                        <span className="text-muted-foreground">APY</span>
                      </div>
                      <Button className="w-full bg-primary">Hacer Staking</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-anubis/10 to-sovereign/10 border border-anubis/20">
                      <h3 className="text-lg font-bold text-foreground mb-2">Pool Premium</h3>
                      <p className="text-sm text-muted-foreground mb-4">Bloqueo de 90 días</p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-anubis">12.8%</span>
                        <span className="text-muted-foreground">APY</span>
                      </div>
                      <Button variant="outline" className="w-full border-anubis/50">Hacer Staking</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-foreground mb-4">Tus Posiciones de Staking</h3>
                  <div className="p-4 rounded-lg bg-muted/20 text-center">
                    <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No tienes posiciones activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Sistema de Recompensas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[
                    { name: 'Contribución Diaria', reward: '10 TAU', progress: 65, icon: Star },
                    { name: 'Referidos', reward: '50 TAU/ref', progress: 40, icon: Gift },
                    { name: 'Creador Verificado', reward: '2% regalías', progress: 100, icon: Badge },
                  ].map((item, i) => (
                    <Card key={i} className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <item.icon className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                        <p className="text-2xl font-bold text-anubis mb-2">{item.reward}</p>
                        <Progress value={item.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{item.progress}% completado</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-anubis/10 border border-primary/20">
                  <h3 className="font-bold text-foreground mb-2">Programa de Lealtad TAMV</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gana TAU por cada acción en el ecosistema. Cuanto más participas, más recompensas recibes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-500/20 text-green-400">+5 TAU por login diario</Badge>
                    <Badge className="bg-primary/20 text-primary">+10 TAU por contenido</Badge>
                    <Badge className="bg-secondary/20 text-secondary">+25 TAU por votar en DAO</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TAUEconomy;

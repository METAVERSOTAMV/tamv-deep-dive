import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  Wallet, Clock, Star, Gift, Lock, Zap, BarChart3, RefreshCw,
  ArrowLeftRight, ShoppingBag, Percent, Shield, Crown, Target,
  Gem, Trophy, Flame, Ticket, CreditCard, Building, PiggyBank
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import tauImage from '@/assets/tau-economy.jpg';

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string | null;
  created_at: string;
  balance_before: number | null;
  balance_after: number | null;
}

interface StakingPool {
  id: string;
  name: string;
  apy: number;
  lockPeriod: number;
  minStake: number;
  totalStaked: number;
  icon: typeof Lock;
  color: string;
}

interface MarketplaceItem {
  id: string;
  name: string;
  price: number;
  type: 'asset' | 'service' | 'nft' | 'subscription';
  seller: string;
  rating: number;
  image?: string;
}

const STAKING_POOLS: StakingPool[] = [
  { id: 'genesis', name: 'Pool Génesis', apy: 5.2, lockPeriod: 30, minStake: 100, totalStaked: 1250000, icon: Star, color: 'from-primary to-cyan-500' },
  { id: 'anubis', name: 'Pool Anubis', apy: 12.8, lockPeriod: 90, minStake: 500, totalStaked: 890000, icon: Crown, color: 'from-amber-500 to-orange-500' },
  { id: 'isabella', name: 'Pool Isabella', apy: 8.5, lockPeriod: 60, minStake: 250, totalStaked: 1050000, icon: Gem, color: 'from-violet-500 to-purple-500' },
  { id: 'sovereign', name: 'Pool Soberano', apy: 25.0, lockPeriod: 365, minStake: 5000, totalStaked: 520000, icon: Shield, color: 'from-emerald-500 to-teal-500' },
];

const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { id: '1', name: 'Avatar Premium KAOS', price: 500, type: 'nft', seller: 'AnubisCreator', rating: 4.9 },
  { id: '2', name: 'Pack Sonidos Épicos', price: 150, type: 'asset', seller: 'SoundMaster', rating: 4.7 },
  { id: '3', name: 'Membresía Creador+', price: 1000, type: 'subscription', seller: 'TAMV Official', rating: 5.0 },
  { id: '4', name: 'Diseño de DreamSpace', price: 2500, type: 'service', seller: 'XRArchitect', rating: 4.8 },
  { id: '5', name: 'NFT Fundador TAMV', price: 10000, type: 'nft', seller: 'GenesisVault', rating: 5.0 },
  { id: '6', name: 'Curso Isabella IA', price: 300, type: 'asset', seller: 'AIAcademy', rating: 4.6 },
];

const SWAP_PAIRS = [
  { from: 'TAU', to: 'USDT', rate: 0.15, change: 2.3 },
  { from: 'TAU', to: 'ETH', rate: 0.000045, change: -1.2 },
  { from: 'TAU', to: 'BTC', rate: 0.0000015, change: 0.8 },
  { from: 'TAU', to: 'MSR', rate: 1.25, change: 5.4 },
];

const TAUEconomyComplete = () => {
  const [balance, setBalance] = useState(2500);
  const [stakedBalance, setStakedBalance] = useState(500);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [selectedSwapPair, setSelectedSwapPair] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const { toast } = useToast();

  const stats = {
    totalEarned: 8420,
    totalSpent: 3150,
    stakingRewards: 520,
    pendingRewards: 85,
    creatorRoyalties: 1290,
    referralBonus: 180,
    lotteryWins: 500,
    governanceRewards: 95
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tamv_credits')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setBalance(profile.tamv_credits || 2500);
        }

        const { data: txs } = await supabase
          .from('tamv_credits_ledger')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (txs) setTransactions(txs);
      } else {
        // Demo data
        setTransactions([
          { id: '1', transaction_type: 'reward', amount: 150, description: 'Recompensa por contenido viral', created_at: new Date().toISOString(), balance_before: 2350, balance_after: 2500 },
          { id: '2', transaction_type: 'staking', amount: 45, description: 'Interés Pool Anubis', created_at: new Date(Date.now() - 86400000).toISOString(), balance_before: 2305, balance_after: 2350 },
          { id: '3', transaction_type: 'marketplace', amount: -200, description: 'Compra Avatar Premium', created_at: new Date(Date.now() - 172800000).toISOString(), balance_before: 2505, balance_after: 2305 },
          { id: '4', transaction_type: 'royalty', amount: 320, description: 'Regalías música KAOS', created_at: new Date(Date.now() - 259200000).toISOString(), balance_before: 2185, balance_after: 2505 },
          { id: '5', transaction_type: 'lottery', amount: 500, description: '¡Ganaste la Lotería TAMV!', created_at: new Date(Date.now() - 345600000).toISOString(), balance_before: 1685, balance_after: 2185 },
        ]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferAddress) {
      toast({ title: "Error", description: "Ingresa monto y dirección", variant: "destructive" });
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount <= 0 || amount > balance) {
      toast({ title: "Error", description: "Monto inválido o saldo insuficiente", variant: "destructive" });
      return;
    }

    toast({ title: "Procesando...", description: `Enviando ${amount} TAU` });

    setTimeout(() => {
      setBalance(prev => prev - amount);
      setTransferAmount('');
      setTransferAddress('');
      toast({ title: "✓ Transferencia Exitosa", description: `${amount} TAU enviados a ${transferAddress.substring(0, 8)}...` });
    }, 1500);
  };

  const handleSwap = () => {
    const amount = parseFloat(swapAmount);
    if (!amount || amount <= 0 || amount > balance) {
      toast({ title: "Error", description: "Monto inválido", variant: "destructive" });
      return;
    }

    const pair = SWAP_PAIRS[selectedSwapPair];
    const received = (amount * pair.rate).toFixed(6);

    toast({ title: "Swap Ejecutado", description: `${amount} TAU → ${received} ${pair.to}` });
    setBalance(prev => prev - amount);
    setSwapAmount('');
  };

  const handleStake = (pool: StakingPool) => {
    const amount = parseFloat(stakeAmount);
    if (!amount || amount < pool.minStake || amount > balance) {
      toast({ title: "Error", description: `Mínimo: ${pool.minStake} TAU`, variant: "destructive" });
      return;
    }

    toast({ title: "Staking Activado", description: `${amount} TAU en ${pool.name} (${pool.apy}% APY)` });
    setBalance(prev => prev - amount);
    setStakedBalance(prev => prev + amount);
    setStakeAmount('');
    setSelectedPool(null);
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      reward: <Gift className="w-4 h-4 text-green-400" />,
      staking: <Lock className="w-4 h-4 text-primary" />,
      transfer: <ArrowUpRight className="w-4 h-4 text-yellow-400" />,
      receive: <ArrowDownLeft className="w-4 h-4 text-green-400" />,
      marketplace: <ShoppingBag className="w-4 h-4 text-pink-400" />,
      royalty: <Star className="w-4 h-4 text-amber-400" />,
      lottery: <Ticket className="w-4 h-4 text-violet-400" />,
      swap: <ArrowLeftRight className="w-4 h-4 text-cyan-400" />,
    };
    return icons[type] || <Coins className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] rounded-3xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img src={tauImage} alt="TAU Economy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 flex flex-col justify-end h-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black mb-2">
              <span className="bg-gradient-to-r from-amber-400 via-primary to-violet-400 bg-clip-text text-transparent">
                TAU
              </span>
              <span className="text-foreground/80"> Economy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Wallet • Staking • Swaps • Marketplace • Lotería
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Card className="bg-gradient-to-br from-primary/20 via-card to-secondary/20 border-primary/30 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance Disponible</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-foreground">{balance.toLocaleString()}</span>
                  <span className="text-2xl font-bold text-primary">TAU</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-muted-foreground">Staking: {stakedBalance.toLocaleString()} TAU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">+18.5% mes</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <ArrowDownLeft className="w-4 h-4" /> Recibir
                </Button>
                <Button variant="outline" className="border-primary/50 gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Enviar
                </Button>
                <Button variant="outline" className="border-amber-500/50 text-amber-400 gap-2">
                  <Lock className="w-4 h-4" /> Staking
                </Button>
                <Button variant="outline" className="border-cyan-500/50 text-cyan-400 gap-2">
                  <ArrowLeftRight className="w-4 h-4" /> Swap
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ganado Total', value: stats.totalEarned, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Gastado Total', value: stats.totalSpent, icon: TrendingDown, color: 'text-red-400' },
          { label: 'Staking Rewards', value: stats.stakingRewards, icon: Lock, color: 'text-primary' },
          { label: 'Regalías', value: stats.creatorRoyalties, icon: Star, color: 'text-amber-400' },
          { label: 'Pendientes', value: stats.pendingRewards, icon: Clock, color: 'text-yellow-400' },
          { label: 'Referidos', value: stats.referralBonus, icon: Gift, color: 'text-pink-400' },
          { label: 'Lotería', value: stats.lotteryWins, icon: Ticket, color: 'text-violet-400' },
          { label: 'Gobernanza', value: stats.governanceRewards, icon: Shield, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="bg-muted/50 mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="wallet" className="gap-2"><Wallet className="w-4 h-4" /> Wallet</TabsTrigger>
          <TabsTrigger value="staking" className="gap-2"><Lock className="w-4 h-4" /> Staking</TabsTrigger>
          <TabsTrigger value="swap" className="gap-2"><ArrowLeftRight className="w-4 h-4" /> Swap</TabsTrigger>
          <TabsTrigger value="marketplace" className="gap-2"><ShoppingBag className="w-4 h-4" /> Marketplace</TabsTrigger>
          <TabsTrigger value="lottery" className="gap-2"><Ticket className="w-4 h-4" /> Lotería</TabsTrigger>
        </TabsList>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Transfer Card */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                  Enviar TAU
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Dirección de Destino</label>
                  <Input
                    placeholder="0x... o usuario TAMV"
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Monto</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((p) => (
                    <Button key={p} variant="outline" size="sm" onClick={() => setTransferAmount(String(Math.floor(balance * p / 100)))}>
                      {p}%
                    </Button>
                  ))}
                </div>
                <Button className="w-full bg-primary" onClick={handleTransfer}>
                  <Zap className="w-4 h-4 mr-2" /> Enviar
                </Button>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Historial
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={loadData}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted/50">{getTransactionIcon(tx.transaction_type)}</div>
                          <div>
                            <p className="font-medium text-foreground text-sm capitalize">{tx.transaction_type.replace('_', ' ')}</p>
                            <p className="text-xs text-muted-foreground">{tx.description}</p>
                          </div>
                        </div>
                        <p className={`font-bold text-sm ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount >= 0 ? '+' : ''}{tx.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staking Tab */}
        <TabsContent value="staking">
          <div className="grid md:grid-cols-2 gap-6">
            {STAKING_POOLS.map((pool) => (
              <motion.div key={pool.id} whileHover={{ scale: 1.02 }}>
                <Card className={`bg-gradient-to-br ${pool.color} border-0 overflow-hidden cursor-pointer`} onClick={() => setSelectedPool(pool)}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <pool.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                        <p className="text-white/70 text-sm">Bloqueo {pool.lockPeriod} días</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-4xl font-black text-white">{pool.apy}%</p>
                        <p className="text-white/70 text-sm">APY</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{(pool.totalStaked / 1000).toFixed(0)}K TAU</p>
                        <p className="text-white/70 text-sm">Total Staked</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-white/70 text-xs">Mínimo: {pool.minStake} TAU</p>
                      <Progress value={(pool.totalStaked / 2000000) * 100} className="mt-2 bg-white/20" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Staking Modal */}
          <AnimatePresence>
            {selectedPool && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPool(null)}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-2xl font-bold mb-4">Staking en {selectedPool.name}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">APY</span>
                      <span className="text-green-400 font-bold">{selectedPool.apy}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bloqueo</span>
                      <span>{selectedPool.lockPeriod} días</span>
                    </div>
                    <Input type="number" placeholder={`Mínimo ${selectedPool.minStake} TAU`} value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
                    <Button className="w-full" onClick={() => handleStake(selectedPool)}>
                      <Lock className="w-4 h-4 mr-2" /> Hacer Staking
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Swap Tab */}
        <TabsContent value="swap">
          <Card className="bg-card/50 backdrop-blur border-border/50 max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
                Swap de Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {SWAP_PAIRS.map((pair, i) => (
                  <div key={i} onClick={() => setSelectedSwapPair(i)} className={`p-4 rounded-xl cursor-pointer transition-all ${selectedSwapPair === i ? 'bg-primary/20 border border-primary/50' : 'bg-muted/20 hover:bg-muted/30'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{pair.from}/{pair.to}</span>
                      <div className="text-right">
                        <p className="font-bold">{pair.rate}</p>
                        <p className={`text-xs ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pair.change >= 0 ? '+' : ''}{pair.change}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Input type="number" placeholder="Cantidad TAU" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} />
              {swapAmount && (
                <div className="p-4 rounded-xl bg-muted/20 text-center">
                  <p className="text-sm text-muted-foreground">Recibirás aproximadamente</p>
                  <p className="text-2xl font-bold text-primary">
                    {(parseFloat(swapAmount || '0') * SWAP_PAIRS[selectedSwapPair].rate).toFixed(6)} {SWAP_PAIRS[selectedSwapPair].to}
                  </p>
                </div>
              )}
              <Button className="w-full bg-primary" onClick={handleSwap}>
                <ArrowLeftRight className="w-4 h-4 mr-2" /> Ejecutar Swap
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MARKETPLACE_ITEMS.map((item) => (
              <Card key={item.id} className="bg-card/50 backdrop-blur border-border/50 overflow-hidden group">
                <div className="h-32 bg-gradient-to-br from-primary/30 to-secondary/30" />
                <CardContent className="p-4">
                  <Badge className="mb-2" variant="outline">{item.type.toUpperCase()}</Badge>
                  <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">por {item.seller}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-primary">{item.price} TAU</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-primary">Comprar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Lottery Tab */}
        <TabsContent value="lottery">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 border-violet-500/30 overflow-hidden">
              <CardContent className="p-8 text-center">
                <Ticket className="w-16 h-16 text-violet-400 mx-auto mb-4" />
                <h2 className="text-4xl font-black mb-2">
                  <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Lotería TAMV
                  </span>
                </h2>
                <p className="text-muted-foreground mb-6">Boletos a 2 TAU • Premios auditables en blockchain</p>
                <div className="bg-card/50 rounded-2xl p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Próximo Premio</p>
                  <p className="text-5xl font-black text-foreground">25,000 TAU</p>
                  <p className="text-sm text-muted-foreground mt-2">Sorteo en 2d 14h 32m</p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button className="bg-violet-500 hover:bg-violet-600">
                    <Ticket className="w-4 h-4 mr-2" /> Comprar 1 Boleto (2 TAU)
                  </Button>
                  <Button variant="outline" className="border-violet-500/50">
                    Comprar 10 Boletos (18 TAU)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TAUEconomyComplete;

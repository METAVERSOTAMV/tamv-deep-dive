import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, TrendingUp, TrendingDown, Send, Download,
  ArrowUpRight, ArrowDownLeft, History, Wallet,
  CreditCard, Gift, ShoppingCart, Users, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'purchase' | 'reward';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending';
}

const TAMVCredits = () => {
  const [balance, setBalance] = useState(25847);
  const [pendingBalance, setPendingBalance] = useState(1250);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sendAmount, setSendAmount] = useState('');

  useEffect(() => {
    // Simular transacciones
    setTransactions([
      { id: '1', type: 'receive', amount: 500, description: 'Recompensa por DreamSpace', timestamp: new Date().toISOString(), status: 'completed' },
      { id: '2', type: 'send', amount: 150, description: 'Compra de arte digital', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'completed' },
      { id: '3', type: 'reward', amount: 1000, description: 'Bonus de creador Elite', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'completed' },
      { id: '4', type: 'purchase', amount: 250, description: 'Suscripción Premium', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
      { id: '5', type: 'receive', amount: 3500, description: 'Venta de NFT', timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
    ]);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-4 h-4" />;
      case 'receive': return <ArrowDownLeft className="w-4 h-4" />;
      case 'purchase': return <ShoppingCart className="w-4 h-4" />;
      case 'reward': return <Gift className="w-4 h-4" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send': return 'text-red-400 bg-red-400/10';
      case 'receive': return 'text-green-400 bg-green-400/10';
      case 'purchase': return 'text-orange-400 bg-orange-400/10';
      case 'reward': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const membershipLevels = [
    { name: 'Free', minCredits: 0, perks: 3 },
    { name: 'Premium', minCredits: 1000, perks: 7 },
    { name: 'VIP', minCredits: 5000, perks: 12 },
    { name: 'Elite', minCredits: 15000, perks: 18 },
    { name: 'Celestial', minCredits: 50000, perks: 25 },
  ];

  const currentLevel = membershipLevels.reduce((acc, level) => 
    balance >= level.minCredits ? level : acc
  , membershipLevels[0]);

  return (
    <div className="min-h-screen bg-quantum p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-anubis/10">
            <Coins className="w-8 h-8 text-anubis" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-anubis">TAMV Credits™</h1>
            <p className="text-muted-foreground">Economía Simbiótica · Sistema de Valor Ético</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-anubis/20 via-card to-primary/20 border-anubis/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-background/20">
                <Wallet className="w-6 h-6 text-anubis" />
              </div>
              <Badge className="bg-anubis/20 text-anubis border-anubis">
                <Star className="w-3 h-3 mr-1" />
                {currentLevel.name}
              </Badge>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Balance Total</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground">{balance.toLocaleString()}</span>
                <span className="text-xl text-anubis font-bold">TC</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                + {pendingBalance.toLocaleString()} TC pendientes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Recibir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: <CreditCard className="w-5 h-5" />, label: 'Comprar Créditos', action: 'Stripe/PayPal' },
              { icon: <Gift className="w-5 h-5" />, label: 'Enviar Regalo', action: 'A otro usuario' },
              { icon: <ShoppingCart className="w-5 h-5" />, label: 'Marketplace', action: 'Arte y NFTs' },
              { icon: <Users className="w-5 h-5" />, label: 'Lotería TAMV', action: '$1 USD = 20,000 chances' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-between h-auto py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.action}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Membership Levels */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Niveles de Membresía</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {membershipLevels.map((level, index) => {
                const isCurrentLevel = level.name === currentLevel.name;
                const isUnlocked = balance >= level.minCredits;
                
                return (
                  <div
                    key={level.name}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrentLevel 
                        ? 'border-anubis bg-anubis/10' 
                        : isUnlocked 
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-border/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-400' : 'bg-muted'}`} />
                        <span className="font-medium text-foreground">{level.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground">{level.minCredits.toLocaleString()} TC</div>
                        <div className="text-xs text-muted-foreground">{level.perks} beneficios</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="mt-6 bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Historial de Transacciones
            </CardTitle>
            <Button variant="outline" size="sm">
              Ver Todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTransactionColor(tx.type)}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-right font-bold ${
                    tx.type === 'send' || tx.type === 'purchase' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {tx.type === 'send' || tx.type === 'purchase' ? '-' : '+'}
                    {tx.amount.toLocaleString()} TC
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TAMVCredits;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, Send, ArrowDownToLine, ArrowUpFromLine, History,
  QrCode, Copy, ExternalLink, Coins, TrendingUp, Lock,
  Unlock, Gift, Ticket, CreditCard, Banknote, Gem, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  icon: string;
  change: number;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'stake' | 'reward';
  amount: number;
  token: string;
  from?: string;
  to?: string;
  timestamp: Date;
  hash: string;
}

const TOKENS: Token[] = [
  { symbol: 'TAMV', name: 'TAMV Coin', balance: 1247.50, value: 2495.00, icon: '🌟', change: 5.2 },
  { symbol: 'MSR', name: 'MSR Token', balance: 500.00, value: 750.00, icon: '⚡', change: -1.3 },
  { symbol: 'TAU', name: 'TAU Credits', balance: 324.75, value: 324.75, icon: '💎', change: 0 },
];

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'receive', amount: 50, token: 'TAMV', from: 'Reward Pool', timestamp: new Date(), hash: '0x1234...abcd' },
  { id: '2', type: 'stake', amount: 100, token: 'TAMV', timestamp: new Date(Date.now() - 86400000), hash: '0x5678...efgh' },
  { id: '3', type: 'send', amount: 25, token: 'TAU', to: '@creator_001', timestamp: new Date(Date.now() - 172800000), hash: '0x9abc...ijkl' },
];

const NubiWalletPanel = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const [showSend, setShowSend] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [stakedAmount, setStakedAmount] = useState(500);

  const totalValue = TOKENS.reduce((sum, t) => sum + t.value, 0);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('nubi_anubis_0x1234567890abcdef');
    toast({ title: 'Dirección copiada', description: 'La dirección de tu wallet ha sido copiada' });
  };

  const handleSend = () => {
    if (!sendAmount || !sendTo) return;
    toast({ 
      title: 'Transacción enviada', 
      description: `${sendAmount} TAMV enviados a ${sendTo}` 
    });
    setShowSend(false);
    setSendAmount('');
    setSendTo('');
  };

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">NubiWallet</h2>
                <p className="text-white/70 text-sm">Multi-Asset Wallet</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={handleCopyAddress}
              >
                <Copy className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <QrCode className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="text-center py-6">
            <p className="text-white/70 text-sm mb-1">Balance Total</p>
            <motion.p 
              className="text-5xl font-black"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </motion.p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-300 font-bold">+$127.45 (3.7%)</span>
              <span className="text-white/50">24h</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setShowSend(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Recibir
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Lock className="w-4 h-4 mr-2" />
              Stake
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Send Modal */}
      <AnimatePresence>
        {showSend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSend(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Enviar TAMV</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Destinatario</label>
                  <Input
                    placeholder="@username o dirección"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Cantidad</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Disponible: 1,247.50 TAMV
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowSend(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleSend}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-6 space-y-3">
          {TOKENS.map((token, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {token.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{token.symbol}</p>
                        <Badge variant="outline" className="text-xs">
                          {token.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {token.balance.toLocaleString()} {token.symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${token.value.toLocaleString()}</p>
                      <p className={`text-sm ${token.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {token.change >= 0 ? '+' : ''}{token.change}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="staking" className="mt-6">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Staking Pool</h3>
                  <p className="text-muted-foreground">APY: 12.5%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-card/50">
                  <p className="text-sm text-muted-foreground">Staked</p>
                  <p className="text-2xl font-black text-cyan-500">{stakedAmount} TAMV</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50">
                  <p className="text-sm text-muted-foreground">Rewards Earned</p>
                  <p className="text-2xl font-black text-emerald-500">+62.5 TAMV</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Stake More
                </Button>
                <Button variant="outline" className="flex-1">
                  <Unlock className="w-4 h-4 mr-2" />
                  Unstake
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quantum Split Info */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Quantum Split Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Creador', value: 70, color: 'bg-violet-500' },
                  { label: 'Bóveda Resiliencia', value: 20, color: 'bg-cyan-500' },
                  { label: 'Alamexa', value: 10, color: 'bg-amber-500' },
                ].map((split, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{split.label}</span>
                      <span className="font-bold">{split.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${split.color}`} style={{ width: `${split.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-3">
          {TRANSACTIONS.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-emerald-500/10' :
                      tx.type === 'send' ? 'bg-red-500/10' :
                      tx.type === 'stake' ? 'bg-cyan-500/10' : 'bg-amber-500/10'
                    }`}>
                      {tx.type === 'receive' ? <ArrowDownToLine className="w-5 h-5 text-emerald-500" /> :
                       tx.type === 'send' ? <ArrowUpFromLine className="w-5 h-5 text-red-500" /> :
                       tx.type === 'stake' ? <Lock className="w-5 h-5 text-cyan-500" /> :
                       <Gift className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.from || tx.to || 'Staking Pool'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === 'receive' || tx.type === 'reward' ? 'text-emerald-500' : ''}`}>
                        {tx.type === 'receive' || tx.type === 'reward' ? '+' : '-'}{tx.amount} {tx.token}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="nfts" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Fundador 500', rarity: 'Legendary', image: '🏆' },
              { name: 'Pioneer Badge', rarity: 'Epic', image: '🎖️' },
              { name: 'DreamSpace #42', rarity: 'Rare', image: '🌌' },
            ].map((nft, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-6xl">
                    {nft.image}
                  </div>
                  <CardContent className="p-3">
                    <p className="font-bold text-sm">{nft.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {nft.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NubiWalletPanel;

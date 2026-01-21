import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Trophy, Zap, Users, Clock, Gift, 
  Sparkles, Shield, TrendingUp, Coins, Star, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface LotteryDraw {
  id: string;
  name: string;
  prizePool: number;
  ticketPrice: number;
  ticketsSold: number;
  maxTickets: number;
  endsAt: Date;
  status: 'active' | 'drawing' | 'completed';
  vrfSeed?: string;
  winners?: { place: number; address: string; prize: number }[];
}

const LotterySystem = () => {
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSpinning, setIsSpinning] = useState(false);

  const currentDraw: LotteryDraw = {
    id: 'TAMV-2025-001',
    name: 'Lotería Civilizatoria #1',
    prizePool: 125000,
    ticketPrice: 10,
    ticketsSold: 8432,
    maxTickets: 15000,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active'
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = currentDraw.endsAt.getTime();
      const diff = end - now;

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentDraw.endsAt]);

  const quantumSplit = [
    { place: '1°', percentage: 40, amount: currentDraw.prizePool * 0.4, color: 'from-yellow-400 to-amber-500' },
    { place: '2°', percentage: 20, amount: currentDraw.prizePool * 0.2, color: 'from-slate-300 to-slate-400' },
    { place: '3°', percentage: 10, amount: currentDraw.prizePool * 0.1, color: 'from-amber-600 to-orange-700' },
    { place: '4-10°', percentage: 15, amount: currentDraw.prizePool * 0.15 / 7, color: 'from-purple-400 to-violet-500' },
    { place: '11-50°', percentage: 15, amount: currentDraw.prizePool * 0.15 / 40, color: 'from-cyan-400 to-teal-500' }
  ];

  const purchaseTickets = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
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
          <div className="relative">
            <Ticket className="w-10 h-10 text-secondary" />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Lotería Civilizatoria
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema de lotería con VRF (Verifiable Random Function), tickets tokenizados en blockchain MSR 
          y distribución Quantum Split transparente
        </p>
      </motion.div>

      {/* Main Draw Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="relative overflow-hidden border-2 border-secondary/50">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10" />
          
          <CardContent className="relative p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Prize Pool */}
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  ${currentDraw.prizePool.toLocaleString()}
                </div>
                <div className="text-muted-foreground mt-2">Pool de Premios</div>
                <Badge variant="outline" className="mt-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Verificado VRF
                </Badge>
              </div>

              {/* Countdown */}
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto text-primary mb-4" />
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: countdown.days, label: 'Días' },
                    { value: countdown.hours, label: 'Hrs' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Seg' }
                  ].map((item, i) => (
                    <div key={i} className="bg-background/80 rounded-lg p-2">
                      <div className="text-2xl font-black text-primary">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Sorteo #{currentDraw.id}
                </div>
              </div>

              {/* Ticket Purchase */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tickets</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedTickets(Math.max(1, selectedTickets - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-bold text-xl">{selectedTickets}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedTickets(Math.min(100, selectedTickets + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio por ticket</span>
                    <span>${currentDraw.ticketPrice} TC</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(currentDraw.ticketPrice * selectedTickets).toFixed(2)} TC
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-secondary to-primary hover:opacity-90"
                  size="lg"
                  onClick={purchaseTickets}
                  disabled={isSpinning}
                >
                  {isSpinning ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Ticket className="w-5 h-5 mr-2" />
                  )}
                  Comprar Tickets
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  Tokenizados en blockchain MSR
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  <Users className="w-4 h-4 inline mr-1" />
                  {currentDraw.ticketsSold.toLocaleString()} tickets vendidos
                </span>
                <span className="text-muted-foreground">
                  {currentDraw.maxTickets.toLocaleString()} máximo
                </span>
              </div>
              <Progress 
                value={(currentDraw.ticketsSold / currentDraw.maxTickets) * 100} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quantum Split Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Distribución Quantum Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quantumSplit.map((split, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${split.color} flex items-center justify-center mb-2`}>
                    <span className="text-white font-bold">{split.place}</span>
                  </div>
                  <div className="text-lg font-bold">{split.percentage}%</div>
                  <div className="text-sm text-primary">
                    ${split.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground">
                  VRF Seed: 0x{crypto.randomUUID().replace(/-/g, '').slice(0, 32)}...
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  50% del pool → premios | 50% → TAMV (20/30/50)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Winners */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Ganadores Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { place: 1, user: '0x7a3f...9c2d', prize: 52000, date: 'Hace 7 días' },
                { place: 2, user: '0x2b1e...5f8a', prize: 26000, date: 'Hace 7 días' },
                { place: 3, user: '0x9d4c...1a7b', prize: 13000, date: 'Hace 7 días' }
              ].map((winner, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      winner.place === 1 ? 'bg-yellow-500' :
                      winner.place === 2 ? 'bg-slate-400' : 'bg-amber-600'
                    }`}>
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-mono text-sm">{winner.user}</div>
                      <div className="text-xs text-muted-foreground">{winner.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">${winner.prize.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">#{winner.place} lugar</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LotterySystem;

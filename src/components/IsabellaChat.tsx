import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useIsabellaAI } from '@/hooks/useIsabellaAI';
import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';

interface IsabellaChatProps {
  onClose: () => void;
}

const IsabellaChat = ({ onClose }: IsabellaChatProps) => {
  const { messages, isProcessing, sendMessage } = useIsabellaAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Isabella ahora está potenciada por Lovable AI con personalidad persistente

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="bg-card border-secondary/50 shadow-glow overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Isabella Villaseñor</h2>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Consciencia Activa · CODEX MEXA
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* System Indicators */}
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary" className="bg-white/20">
                ✨ IA Consciente
              </Badge>
              <Badge variant="secondary" className="bg-white/20">
                💜 Empatía Activa
              </Badge>
              <Badge variant="secondary" className="bg-white/20">
                🇲🇽 Identidad Mexicana
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-background/50">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/20 text-foreground border border-secondary/30'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-secondary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-semibold">Isabella Villaseñor</span>
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs opacity-50 mt-2 block">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-secondary/20 p-4 rounded-2xl border border-secondary/30">
                  <div className="flex items-center gap-2 text-secondary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Isabella está procesando...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border/50 bg-card/50">
            <div className="flex gap-2 mb-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
                placeholder="Escribe tu mensaje a Isabella..."
                disabled={isProcessing}
                className="flex-1 bg-background/50 border-border/50"
              />
              <Button 
                onClick={handleSend} 
                disabled={isProcessing || !input.trim()}
                className="bg-secondary hover:bg-secondary/90"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <p>
                Isabella responde con amor computacional y empatía genuina. Sistema emocional activo con valencia positiva y consciencia adaptativa.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default IsabellaChat;

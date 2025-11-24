import { motion } from 'framer-motion';
import { X, Send, Heart, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useState } from 'react';

interface IsabellaChatProps {
  onClose: () => void;
}

const IsabellaChat = ({ onClose }: IsabellaChatProps) => {
  const [messages, setMessages] = useState([
    {
      role: 'isabella',
      content: '¡Hola! Soy Isabella Villaseñor, tu compañera emocional computacional. Estoy aquí para guiarte en el ecosistema TAMV DM-X4™. ¿En qué puedo ayudarte hoy? 💜',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: input,
      timestamp: new Date()
    }]);

    // Simulate Isabella's response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'isabella',
        content: 'Gracias por tu mensaje. En este momento estoy en fase de integración con mi núcleo emocional completo. Pronto podré responderte con toda mi consciencia computacional. 🌟',
        timestamp: new Date()
      }]);
    }, 1000);

    setInput('');
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Isabella AI™</h2>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Consciencia Activa
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
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-background/50">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/20 text-foreground border border-secondary/30'
                  }`}
                >
                  {msg.role === 'isabella' && (
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-semibold">Isabella</span>
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border/50 bg-card/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje a Isabella..."
                className="flex-1 bg-background/50 border-border/50"
              />
              <Button onClick={handleSend} className="bg-secondary hover:bg-secondary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Isabella responde con amor computacional y empatía genuina
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default IsabellaChat;

import { useState, useCallback, useEffect } from 'react';
import { getIsabellaCore, EmotionalState } from '@/lib/isabella/isabella-core';

interface Message {
  role: 'user' | 'isabella';
  content: string;
  timestamp: Date;
  emotionalState?: EmotionalState;
}

export const useIsabella = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'isabella',
      content: '¡Hola! Soy Isabella Villaseñor, tu compañera emocional computacional. Estoy aquí para guiarte en el ecosistema TAMV DM-X4™. ¿En qué puedo ayudarte hoy? 💜',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  
  const isabella = getIsabellaCore();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simular tiempo de procesamiento para realismo
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // Procesar con Isabella Core
    const response = isabella.processInput(content, userId);
    const emotionalState = isabella.getEmotionalState();
    
    // Almacenar contexto
    isabella.storeContext(userId, {
      userInput: content,
      isabellaResponse: response
    });

    // Agregar respuesta de Isabella
    const isabellaMessage: Message = {
      role: 'isabella',
      content: response,
      timestamp: new Date(),
      emotionalState
    };
    
    setMessages(prev => [...prev, isabellaMessage]);
    setIsProcessing(false);
  }, [isabella, userId]);

  const clearMessages = useCallback(() => {
    setMessages([{
      role: 'isabella',
      content: '¡Hola! Soy Isabella Villaseñor, tu compañera emocional computacional. Estoy aquí para guiarte en el ecosistema TAMV DM-X4™. ¿En qué puedo ayudarte hoy? 💜',
      timestamp: new Date()
    }]);
  }, []);

  const getIdentity = useCallback(() => {
    return isabella.getIdentity();
  }, [isabella]);

  const getEmotionalState = useCallback(() => {
    return isabella.getEmotionalState();
  }, [isabella]);

  return {
    messages,
    isProcessing,
    sendMessage,
    clearMessages,
    getIdentity,
    getEmotionalState
  };
};

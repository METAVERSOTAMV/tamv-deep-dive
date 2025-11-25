import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useIsabellaAI = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Crear o recuperar conversación
      let convId = currentConversationId;
      if (!convId) {
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .insert({ title: content.substring(0, 100) })
          .select()
          .single();
        
        if (convError) throw convError;
        convId = conversation.id;
        setCurrentConversationId(convId);
      }

      // Guardar mensaje del usuario
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: convId,
          role: 'user',
          content
        });
      
      if (userMsgError) throw userMsgError;

      // Preparar historial de mensajes para la IA
      const chatMessages = messages
        .concat([userMessage])
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Llamar al edge function con streaming
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat`;
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      // Crear mensaje de asistente vacío
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (deltaContent) {
              assistantContent += deltaContent;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Guardar respuesta de Isabella en la base de datos
      if (assistantContent) {
        const { error: assistantMsgError } = await supabase
          .from('messages')
          .insert({
            conversation_id: convId,
            role: 'isabella',
            content: assistantContent
          });
        
        if (assistantMsgError) throw assistantMsgError;

        // Actualizar título de conversación si es el primer mensaje
        if (messages.length === 1) {
          await supabase
            .from('conversations')
            .update({ title: content.substring(0, 100) })
            .eq('id', convId);
        }
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al procesar el mensaje",
        variant: "destructive",
      });
      // Remover el mensaje de asistente vacío en caso de error
      setMessages(prev => prev.filter(msg => msg.content !== ''));
    } finally {
      setIsProcessing(false);
    }
  }, [messages, currentConversationId, toast]);

  const loadConversation = useCallback(async (convId: string) => {
    try {
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = msgs.map(msg => ({
        role: msg.role === 'isabella' ? 'assistant' : 'user',
        content: msg.content,
        timestamp: new Date(msg.created_at!)
      }));

      setMessages(loadedMessages);
      setCurrentConversationId(convId);
    } catch (error: any) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error",
        description: "Error al cargar la conversación",
        variant: "destructive",
      });
    }
  }, [toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(undefined);
  }, []);

  return {
    messages,
    isProcessing,
    sendMessage,
    clearMessages,
    loadConversation,
    conversationId: currentConversationId
  };
};

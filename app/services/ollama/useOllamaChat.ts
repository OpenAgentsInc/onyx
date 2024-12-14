import { useCallback, useState } from "react"
import { pylonConfig } from "@/config/websocket"
import { useWebSocket } from "@/services/websocket/useWebSocket"
import { ChatMessage, ChatRequest } from "@/types/ollama"

export const useOllamaChat = (model: string = 'llama3.2') => {
  const { state, sendMessage } = useWebSocket(pylonConfig);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendChatMessage = useCallback(async (content: string) => {
    if (!state.connected) {
      throw new Error('WebSocket is not connected');
    }

    setIsLoading(true);
    setError(null);

    const newMessage: ChatMessage = {
      role: 'user',
      content,
    };

    // Add user message to the list
    setMessages(prev => [...prev, newMessage]);

    try {
      // Send request directly to ollama/chat endpoint
      const result = await sendMessage({
        jsonrpc: '2.0',
        method: 'ollama/chat',
        params: {
          model,
          messages: [...messages, newMessage],
        },
      });

      const assistantMessage: ChatMessage = result.message;
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return assistantMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [state.connected, sendMessage, messages, model]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendChatMessage,
    clearMessages,
    connected: state.connected,
  };
};

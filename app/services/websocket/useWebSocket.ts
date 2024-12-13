import { useState, useEffect, useCallback } from 'react';
import { WebSocketService } from './WebSocketService';
import { WebSocketConfig, ResponseMessage } from '../../types/websocket';
import { useLocalObservable } from 'mobx-react-lite';

// Create a singleton instance
let globalWsService: WebSocketService | null = null;

export const useWebSocket = (config: WebSocketConfig) => {
  // Use the existing instance or create a new one
  const wsService = useLocalObservable(() => {
    if (!globalWsService) {
      globalWsService = new WebSocketService(config);
    }
    return globalWsService;
  });

  const [messages, setMessages] = useState<ResponseMessage[]>([]);

  useEffect(() => {
    console.log('useWebSocket effect running');
    
    // Set up response handler
    const unsubscribeResponse = wsService.onResponse((message: ResponseMessage) => {
      console.log('Response received in hook:', message);
      setMessages(prev => [...prev, message]);
    });

    // Connect to WebSocket if not already connected
    if (!wsService.state.connected && !wsService.state.connecting) {
      console.log('Connecting from hook');
      wsService.connect();
    } else {
      console.log('Current wsService state:', wsService.state);
    }

    return () => {
      unsubscribeResponse();
    };
  }, [wsService]);

  const sendMessage = useCallback(async (message: any) => {
    if (!wsService.state.connected) {
      console.log('Cannot send message - not connected. Current state:', wsService.state);
      throw new Error('WebSocket is not connected');
    }
    return wsService.sendAndWait(message);
  }, [wsService]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    state: wsService.state,
    messages,
    sendMessage,
    clearMessages,
    // Expose resource methods
    listResources: wsService.listResources,
    readResource: wsService.readResource,
    watchResource: wsService.watchResource,
    unwatchResource: wsService.unwatchResource,
  };
};
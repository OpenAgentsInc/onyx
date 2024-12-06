import { useEffect, useCallback, useRef } from 'react';
import { WebSocketService } from './WebSocketService';
import { WebSocketConfig, ResponseMessage } from '../../types/websocket';
import { observer } from 'mobx-react-lite';

export const useWebSocket = observer((wsService: WebSocketService) => {
  const responseHandlers = useRef<Map<string, (response: ResponseMessage) => void>>(new Map());

  useEffect(() => {
    // Set up response handler
    const unsubscribeResponse = wsService.onMessage('response', (message: ResponseMessage) => {
      const handler = responseHandlers.current.get(message.id);
      if (handler) {
        handler(message);
        responseHandlers.current.delete(message.id);
      }
    });

    // Connect if not already connected
    if (!wsService.state.connected && !wsService.state.connecting) {
      console.log('Connecting WebSocket...');
      wsService.connect().catch(error => {
        console.error('Failed to connect:', error);
      });
      console.log('Current wsService state:', wsService.state);
    }

    return () => {
      unsubscribeResponse();
    };
  }, [wsService]);

  const sendMessage = useCallback(async (query: string, teamId?: string) => {
    if (!wsService.state.connected) {
      console.log('Cannot send message - not connected. Current state:', wsService.state);
      throw new Error('WebSocket is not connected');
    }

    return wsService.sendQuery(query, teamId);
  }, [wsService]);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, [wsService]);

  return {
    state: wsService.state,
    sendMessage,
    disconnect
  };
});

export const createWebSocketService = (config: WebSocketConfig): WebSocketService => {
  return new WebSocketService(config);
};
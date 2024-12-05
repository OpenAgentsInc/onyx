import { useState, useEffect, useCallback } from 'react';
import WebSocketService from './WebSocketService';
import { WebSocketConfig, WebSocketMessage, WebSocketState, AskRequest } from './types';

export const useWebSocket = (config: WebSocketConfig) => {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
  });

  const [ws] = useState(() => new WebSocketService(config));

  useEffect(() => {
    setState(prev => ({ ...prev, connecting: true }));
    
    const unsubscribeStatus = ws.onStatusChange((connected) => {
      setState(prev => ({
        ...prev,
        connected,
        connecting: false,
        error: null,
      }));
    });

    ws.connect();

    return () => {
      unsubscribeStatus();
      ws.disconnect();
    };
  }, [ws]);

  const sendMessage = useCallback((query: string, teamId?: string) => {
    const message: WebSocketMessage = {
      type: 'ask',
      id: Math.random().toString(36).substring(7),
      payload: {
        query,
        team_id: teamId,
      } as AskRequest,
    };

    ws.send(message);
    return message.id;
  }, [ws]);

  const subscribe = useCallback((handler: (message: WebSocketMessage) => void) => {
    return ws.onMessage(handler);
  }, [ws]);

  return {
    state,
    sendMessage,
    subscribe,
  };
};

export default useWebSocket;
import { WebSocketConfig } from '../types/websocket';
import env from './env';

export const websocketConfig: WebSocketConfig = {
  url: env.wsUrl,
  maxReconnectAttempts: 5,
  reconnectInterval: 3000,
  reconnectBackoff: 'exponential',
  maxBackoffTime: 30000,
  pingInterval: 30000,
  pongTimeout: 5000,
  apiKey: env.apiKey
};

// For backward compatibility
export const WS_CONFIG = websocketConfig;
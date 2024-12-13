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

export const pylonConfig: WebSocketConfig = {
  url: 'ws://localhost:8080/mcp',
  maxReconnectAttempts: 5,
  reconnectInterval: 3000,
  reconnectBackoff: 'exponential',
  maxBackoffTime: 30000,
  pingInterval: 30000,
  pongTimeout: 5000,
  apiKey: 'test-key' // We'll implement proper auth later
};

// For backward compatibility
export const WS_CONFIG = websocketConfig;
import { WebSocketConfig } from '../types/websocket';

export const websocketConfig: WebSocketConfig = {
  url: process.env.WEBSOCKET_URL || 'ws://localhost:3000',
  maxReconnectAttempts: 5,
  reconnectInterval: 1000,
  reconnectBackoff: 'exponential',
  maxBackoffTime: 30000,
  pingInterval: 30000,
  pongTimeout: 5000
};
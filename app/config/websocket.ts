import { WebSocketConfig } from '../services/websocket/types';

export const WS_CONFIG: WebSocketConfig = {
  url: 'ws://localhost:8000/ws',  // Updated path
  apiKey: process.env.NEXUS_API_KEY || '',
  reconnectAttempts: 5,
  reconnectInterval: 3000,
};
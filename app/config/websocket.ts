import { WebSocketConfig } from '../services/websocket/types';

export const WS_CONFIG: WebSocketConfig = {
  url: 'ws://localhost:8000',  // Use root path since that's where the server is listening
  apiKey: process.env.NEXUS_API_KEY || '',
  reconnectAttempts: 5,
  reconnectInterval: 3000,
};
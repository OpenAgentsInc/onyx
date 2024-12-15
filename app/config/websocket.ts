import { WebSocketConfig } from "../types/websocket"
import env from "./env"

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

// Replace PYLON_IP with your Pylon machine's local IP address (e.g., "192.168.1.123")
const PYLON_IP = "192.168.1.189"; // Your Pylon machine's IP

export const pylonConfig: WebSocketConfig = {
  url: `ws://${PYLON_IP}:8081/mcp`, // Using port 8081 since that's what the server is using
  // url: 'ws://localhost:8080/mcp', // Using port 8081 since that's what the server is using
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

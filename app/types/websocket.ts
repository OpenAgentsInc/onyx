export interface WebSocketConfig {
  url: string;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  reconnectBackoff?: 'linear' | 'exponential';
  maxBackoffTime?: number;
  pingInterval?: number;
  pongTimeout?: number;
  apiKey?: string;
}

export interface WebSocketMessage {
  type: string;
  id: string;
  payload: any;
}

export interface ConnectionState {
  connected: boolean;
  connecting: boolean;
  error?: string;
}

export interface AskMessage extends WebSocketMessage {
  type: 'ask';
  payload: {
    query: string;
    team_id?: string;
  };
}

export interface ResponseMessage extends WebSocketMessage {
  type: 'response';
  payload: {
    content: string;
    error?: string;
  };
}

export interface AuthMessage extends WebSocketMessage {
  type: 'auth';
  payload: {
    apiKey: string;
  };
}
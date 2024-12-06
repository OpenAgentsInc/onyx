export interface TransportOptions {
  url: string;
  options?: {
    reconnect?: boolean;
    backoff?: 'exponential' | 'linear';
    maxRetries?: number;
  };
}

export interface TransportMessage {
  type: string;
  payload: any;
}

export interface TransportStatus {
  connected: boolean;
  lastConnected?: Date;
  reconnectAttempts: number;
}

export interface TransportEvents {
  onMessage: (message: TransportMessage) => void;
  onError: (error: Error) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}
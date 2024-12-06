import { TransportOptions, TransportMessage, TransportStatus, TransportEvents } from './types';
import { ConnectionError } from '../client/errors';

export class WebSocketTransport {
  private ws: WebSocket | null = null;
  private options: TransportOptions;
  private status: TransportStatus = {
    connected: false,
    reconnectAttempts: 0
  };
  private events: TransportEvents = {
    onMessage: () => {},
    onError: () => {},
    onConnect: () => {},
    onDisconnect: () => {}
  };

  constructor(options: TransportOptions) {
    this.options = options;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.options.url);

        this.ws.onopen = () => {
          this.status.connected = true;
          this.status.lastConnected = new Date();
          this.status.reconnectAttempts = 0;
          this.events.onConnect();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as TransportMessage;
            this.events.onMessage(message);
          } catch (error) {
            this.events.onError(new Error('Invalid message format'));
          }
        };

        this.ws.onerror = (error) => {
          this.events.onError(error as Error);
          reject(new ConnectionError('WebSocket connection error'));
        };

        this.ws.onclose = () => {
          this.status.connected = false;
          this.events.onDisconnect();
          if (this.options.options?.reconnect) {
            this.handleReconnect();
          }
        };
      } catch (error) {
        reject(new ConnectionError('Failed to create WebSocket connection'));
      }
    });
  }

  private async handleReconnect(): Promise<void> {
    const maxRetries = this.options.options?.maxRetries ?? Infinity;
    if (this.status.reconnectAttempts >= maxRetries) {
      this.events.onError(new ConnectionError('Max reconnection attempts reached'));
      return;
    }

    const backoffTime = this.calculateBackoff();
    await new Promise(resolve => setTimeout(resolve, backoffTime));
    
    this.status.reconnectAttempts++;
    this.connect().catch(() => this.handleReconnect());
  }

  private calculateBackoff(): number {
    const base = 1000; // 1 second
    if (this.options.options?.backoff === 'exponential') {
      return Math.min(base * Math.pow(2, this.status.reconnectAttempts), 30000);
    }
    return base * (this.status.reconnectAttempts + 1);
  }

  async send(message: TransportMessage): Promise<void> {
    if (!this.ws || !this.status.connected) {
      throw new ConnectionError('Not connected');
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      throw new ConnectionError('Failed to send message');
    }
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  setEventHandlers(handlers: Partial<TransportEvents>): void {
    this.events = { ...this.events, ...handlers };
  }

  getStatus(): TransportStatus {
    return { ...this.status };
  }
}
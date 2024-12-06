import { WebSocketConfig } from '../../types/websocket';

interface WebSocketMessage {
  type: string;
  payload: any;
}

interface WebSocketError {
  code: number;
  message: string;
  details?: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
      this.startPingInterval();
    } catch (error) {
      this.handleError(error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.ws.onclose = () => {
      this.handleClose();
    };

    this.ws.onerror = (event) => {
      this.handleError(event);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        if (message.type === 'pong') {
          this.handlePong();
        } else {
          this.emit('message', message);
        }
      } catch (error) {
        this.handleError(new Error('Invalid message format'));
      }
    };
  }

  private handleClose(): void {
    this.cleanup();
    this.emit('disconnected');

    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      const delay = this.calculateReconnectDelay();
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      this.emit('error', {
        code: 1006,
        message: 'Maximum reconnection attempts reached'
      });
    }
  }

  private handleError(error: unknown): void {
    const wsError: WebSocketError = {
      code: 1011,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    this.emit('error', wsError);
  }

  private calculateReconnectDelay(): number {
    if (this.config.reconnectBackoff === 'exponential') {
      const delay = this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts);
      return Math.min(delay, this.config.maxBackoffTime);
    }
    return this.config.reconnectInterval;
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, this.config.pingInterval);
  }

  private sendPing(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
      this.setPongTimeout();
    }
  }

  private setPongTimeout(): void {
    this.pongTimeout = setTimeout(() => {
      this.handlePongTimeout();
    }, this.config.pongTimeout);
  }

  private handlePong(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private handlePongTimeout(): void {
    this.emit('error', {
      code: 1001,
      message: 'Pong timeout - connection is stale'
    });
    this.close();
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        this.handleError(error);
      }
    } else {
      this.handleError(new Error('WebSocket is not connected'));
    }
  }

  close(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private cleanup(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private emit(event: string, data?: any): void {
    // Implement event emission logic here
    // This could be using EventEmitter or a custom event system
    console.log(`WebSocket ${event}:`, data);
  }
}
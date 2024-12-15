import { makeAutoObservable, runInAction } from "mobx"
import {
  AskMessage, AuthMessage, ConnectionState, ResponseMessage, WebSocketConfig,
  WebSocketMessage
} from "../../types/websocket"

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map();
  private responseHandlers: Map<string, (response: any) => void> = new Map();
  private messageId = 0;
  private cleanupCallbacks: (() => void)[] = [];

  state: ConnectionState = {
    connected: false,
    connecting: false
  };

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...config
    };
    makeAutoObservable(this);
  }

  private setState(updates: Partial<ConnectionState>) {
    runInAction(() => {
      Object.assign(this.state, updates);
      console.log('State updated:', this.state);
    });
  }

  private getNextId() {
    return (++this.messageId).toString();
  }

  connect = async () => {
    if (this.state.connected || this.state.connecting) {
      console.log('Already connected or connecting, current state:', this.state);
      return;
    }

    this.setState({ connecting: true });
    console.log('Connecting to WebSocket...', this.config.url);

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        console.log('WebSocket connection opened, sending initialize message');
        // Send initialize message when connection opens
        const initMessage = {
          jsonrpc: '2.0',
          method: 'initialize',
          params: {
            capabilities: {
              experimental: {},
              roots: {
                list_changed: true
              },
              sampling: {}
            },
            clientInfo: {
              name: 'onyx',
              version: '0.1.0'
            },
            protocolVersion: '0.1.0'
          },
          id: this.getNextId()
        };
        this.send(initMessage);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event);
        this.handleClose(event);
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        // In React Native, we don't have ErrorEvent, so we create our own error object
        const errorMessage = event.message || 'Unknown WebSocket error';
        this.handleError(errorMessage);
      };

      this.ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        this.handleMessage(event);
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('WebSocket connection error:', error);
      this.setState({
        error: `Connection failed: ${message}`,
        connecting: false
      });
      this.attemptReconnect();
    }
  };

  private handleMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Parsed message:', message);

      // Handle initialization response
      if (message.id && message.result?.capabilities) {
        console.log('Initialization successful');
        this.setState({
          connected: true,
          connecting: false,
          error: undefined
        });
        this.reconnectAttempts = 0;
        return;
      }

      // Handle error messages
      if (message.error) {
        console.error('Received error message:', message);
        this.setState({
          error: message.error.message || 'Unknown error'
        });
        return;
      }

      // Handle response messages
      if (message.id && this.responseHandlers.has(message.id)) {
        const handler = this.responseHandlers.get(message.id);
        if (handler) {
          handler(message);
          this.responseHandlers.delete(message.id);
        }
        return;
      }

      // Handle other messages
      if (message.method) {
        console.log('Looking for handler for message method:', message.method);
        const handler = this.messageHandlers.get(message.method);
        if (handler) {
          console.log('Found handler for message method:', message.method);
          handler(message);
        } else {
          console.warn('No handler found for message method:', message.method);
        }
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error, event.data);
    }
  };

  private handleClose = (event: WebSocket.CloseEvent) => {
    const codes: Record<number, string> = {
      1000: 'Normal closure',
      1001: 'Going away',
      1002: 'Protocol error',
      1003: 'Unsupported data',
      1005: 'No status received',
      1006: 'Abnormal closure',
      1007: 'Invalid frame payload data',
      1008: 'Policy violation',
      1009: 'Message too big',
      1010: 'Mandatory extension',
      1011: 'Internal server error',
      1015: 'TLS handshake'
    };

    const reason = event.code in codes
      ? `${codes[event.code]}${event.reason ? `: ${event.reason}` : ''}`
      : `Unknown error ${event.code}${event.reason ? `: ${event.reason}` : ''}`;

    console.log('WebSocket closed:', reason);
    this.setState({
      error: `Connection closed - ${reason}`,
      connected: false,
      connecting: false
    });

    // Only attempt reconnect if it wasn't a normal closure
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  };

  private handleError = (error: string) => {
    const errorMessage = `Connection error: ${error}`;
    console.error('WebSocket error:', errorMessage);
    this.setState({
      error: errorMessage,
      connected: false,
      connecting: false
    });
    this.attemptReconnect();
  };

  private attemptReconnect = () => {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5)) {
      console.log('Max reconnection attempts reached');
      this.setState({
        error: 'Max reconnection attempts reached',
        connected: false,
        connecting: false
      });
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`);
    setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  };

  send = (message: any) => {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      throw new Error('WebSocket is not connected');
    }
    console.log('Sending message:', message);
    this.ws.send(JSON.stringify(message));
  };

  // Send a message and wait for response
  sendAndWait = async (message: any): Promise<any> => {
    const id = this.getNextId();
    const fullMessage = { ...message, id };

    return new Promise((resolve, reject) => {
      this.responseHandlers.set(id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });
      this.send(fullMessage);
    });
  };

  // Resource methods
  listResources = async (path?: string) => {
    return this.sendAndWait({
      jsonrpc: '2.0',
      method: 'resource/list',
      params: { path }
    });
  };

  readResource = async (path: string) => {
    return this.sendAndWait({
      jsonrpc: '2.0',
      method: 'resource/read',
      params: { path }
    });
  };

  watchResource = async (path: string) => {
    return this.sendAndWait({
      jsonrpc: '2.0',
      method: 'resource/watch',
      params: { path }
    });
  };

  unwatchResource = async (path: string) => {
    return this.sendAndWait({
      jsonrpc: '2.0',
      method: 'resource/unwatch',
      params: { path }
    });
  };

  // Chat methods
  sendChatMessage = async (message: any) => {
    return this.sendAndWait(message);
  };

  // Original methods
  sendQuery = (query: string, teamId?: string) => {
    const message = {
      jsonrpc: '2.0',
      method: 'ask',
      params: {
        query,
        team_id: teamId
      },
      id: this.getNextId()
    };
    this.send(message);
    return message.id;
  };

  onMessage = (method: string, handler: (message: any) => void) => {
    console.log('Registering handler for message method:', method);
    this.messageHandlers.set(method, handler);
    const cleanup = () => this.messageHandlers.delete(method);
    this.cleanupCallbacks.push(cleanup);
    return cleanup;
  };

  onResponse = (handler: (message: ResponseMessage) => void) => {
    return this.onMessage('response', handler as (message: any) => void);
  };

  cleanup = () => {
    console.log('Cleaning up WebSocket service');
    this.cleanupCallbacks.forEach(cleanup => cleanup());
    this.cleanupCallbacks = [];
    this.messageHandlers.clear();
    this.responseHandlers.clear();
  };

  disconnect = () => {
    console.log('Disconnecting WebSocket');
    if (this.ws) {
      // Send a close frame with normal closure code
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    this.setState({
      connected: false,
      connecting: false
    });
    this.cleanup();
  };
}

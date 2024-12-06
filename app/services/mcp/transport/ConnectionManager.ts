import { WebSocketTransport } from './WebSocketTransport';
import { ConnectionError } from '../client/errors';

export class ConnectionManager {
  private transport: WebSocketTransport | null = null;
  private reconnectAttempts: number = 0;
  private networkType: 'wifi' | 'cellular' | 'offline' = 'wifi';
  private isInitialized: boolean = false;

  async initialize(transport: WebSocketTransport): Promise<void> {
    this.transport = transport;
    this.isInitialized = true;

    transport.setEventHandlers({
      onDisconnect: () => this.handleDisconnect(),
      onError: (error) => this.handleError(error)
    });
  }

  async handleDisconnect(): Promise<void> {
    if (this.networkType === 'offline' || !this.transport) return;

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    await new Promise(resolve => setTimeout(resolve, delay));
    await this.reconnect();
  }

  private async reconnect(): Promise<void> {
    if (!this.transport) {
      throw new ConnectionError('Transport not initialized');
    }

    try {
      await this.transport.connect();
      this.reconnectAttempts = 0;
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private handleError(error: Error): void {
    console.error('Connection error:', error);
    // Implement error reporting/logging here
  }

  async optimizeForNetwork(type: 'wifi' | 'cellular' | 'offline'): Promise<void> {
    this.networkType = type;
    
    // Adjust connection behavior based on network type
    switch (type) {
      case 'wifi':
        // Aggressive reconnection, larger payloads ok
        break;
      case 'cellular':
        // Conservative reconnection, smaller payloads
        break;
      case 'offline':
        // No reconnection attempts, queue operations
        if (this.transport) {
          await this.transport.disconnect();
        }
        break;
    }
  }

  getStatus(): { 
    isConnected: boolean; 
    networkType: string; 
    reconnectAttempts: number;
  } {
    return {
      isConnected: this.transport?.getStatus().connected ?? false,
      networkType: this.networkType,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}
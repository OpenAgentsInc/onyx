import EventEmitter from "eventemitter3"

interface WebSocketEvents {
  open: () => void;
  close: () => void;
  error: (error: Error) => void;
  message: (data: string) => void;
}

export class WebSocketWrapper extends EventEmitter<WebSocketEvents> {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    super();
    this.url = url;
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connection opened');
        this.emit('open');
      };

      this.ws.onmessage = (event) => {
        console.log('[WebSocket] Message received');
        this.emit('message', event.data);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.emit('close');
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.emit('error', new Error('WebSocket error occurred'));
      };

    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.emit('error', error instanceof Error ? error : new Error('Connection failed'));
    }
  }

  send(data: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error('[WebSocket] Cannot send message - connection not open');
      this.emit('error', new Error('Connection not open'));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

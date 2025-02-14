import { WebSocketWrapper } from "./wrapper"

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocketWrapper | null = null;
  private messageHandlers: ((data: string) => void)[] = [];
  private errorHandlers: ((error: string) => void)[] = [];

  private constructor() { }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  initialize(wsUrl: string) {
    console.log("[WSManager] Initializing WebSocket connection");

    if (!this.ws) {
      console.log("[WSManager] Creating new WebSocket connection to", wsUrl);
      this.ws = new WebSocketWrapper(wsUrl);

      this.ws.on("message", (data: string) => {
        console.log("[WSManager] Received message:", data);
        this.messageHandlers.forEach((handler) => handler(data));
      });

      this.ws.on("open", () => {
        console.log("[WSManager] WebSocket connection opened");
      });

      this.ws.on("close", () => {
        console.log("[WSManager] WebSocket connection closed");
      });

      this.ws.on("error", (error: Error) => {
        console.error("[WSManager] WebSocket error:", error.message);
        this.errorHandlers.forEach((handler) => handler(error.message));
      });

      this.ws.on("auth_error", (error: string) => {
        console.error("[WSManager] WebSocket auth error:", error);
        this.errorHandlers.forEach((handler) =>
          handler(`Authentication error: ${error}`)
        );
      });
    } else {
      console.log("[WSManager] Using existing WebSocket connection");
    }
  }

  onMessage(handler: (data: string) => void) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  onError(handler: (error: string) => void) {
    this.errorHandlers.push(handler);
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  sendMessage(message: any) {
    if (this.ws) {
      console.log("[WSManager] Sending message:", message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("[WSManager] WebSocket not initialized");
    }
  }

  cleanup() {
    console.log("[WSManager] Cleaning up WebSocket connection");
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
    this.errorHandlers = [];
  }
}

export const wsManager = WebSocketManager.getInstance();

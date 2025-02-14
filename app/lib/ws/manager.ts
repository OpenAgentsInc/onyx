// manager.ts
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
    this.logInfo("Initializing WebSocket connection");

    if (!this.ws) {
      this.logInfo("Creating new WebSocket connection", { wsUrl });
      this.ws = new WebSocketWrapper(wsUrl);

      this.ws.on("message", (data: string) => {
        this.logInfo("Received message", { data });
        this.messageHandlers.forEach((handler) => handler(data));
      });

      this.ws.on("open", () => {
        this.logInfo("WebSocket connection opened");
      });

      this.ws.on("close", () => {
        this.logInfo("WebSocket connection closed");
      });

      this.ws.on("error", (error: Error) => {
        this.logError("WebSocket error", { message: error.message });
        this.errorHandlers.forEach((handler) => handler(error.message));
      });

      this.ws.on("auth_error", (error: string) => {
        this.logError("WebSocket auth error", { error });
        this.errorHandlers.forEach((handler) =>
          handler(`Authentication error: ${error}`)
        );
      });
    } else {
      this.logInfo("Using existing WebSocket connection");
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
      this.logInfo("Sending message", { message });
      this.ws.send(JSON.stringify(message));
    } else {
      this.logError("WebSocket not initialized");
    }
  }

  cleanup() {
    this.logInfo("Cleaning up WebSocket connection");
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
    this.errorHandlers = [];
  }

  private logInfo(msg: string, extra?: Record<string, any>) {
    console.log(JSON.stringify({ level: "info", source: "WSManager", msg, ...extra }));
  }

  private logError(msg: string, extra?: Record<string, any>) {
    console.error(JSON.stringify({ level: "error", source: "WSManager", msg, ...extra }));
  }
}

export const wsManager = WebSocketManager.getInstance();

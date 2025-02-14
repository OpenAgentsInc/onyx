// wrapper.ts
import EventEmitter from "eventemitter3"
import { githubAuth } from "../auth/githubAuth"

interface WebSocketEvents {
  open: () => void;
  close: () => void;
  error: (error: Error) => void;
  message: (data: string) => void;
  auth_error: (error: string) => void;
}

export class WebSocketWrapper extends EventEmitter<WebSocketEvents> {
  private ws: WebSocket | null = null;
  private url: string;
  private retryCount = 0;
  private readonly maxRetries = 3;

  constructor(url: string) {
    super();
    this.url = url;
    this.logInfo("Initializing with URL", { url });
    this.connect();
  }

  private async connect() {
    try {
      const sessionToken = await githubAuth.getSession();
      // Log only existence of token, not the token value
      this.logInfo("Got session token", { exists: !!sessionToken });
      if (!sessionToken) {
        throw new Error("Not authenticated");
      }

      const wsUrl = new URL(this.url);
      wsUrl.searchParams.append("session", sessionToken);
      this.logInfo("Connecting with URL", { wsUrl: wsUrl.toString() });

      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = () => {
        this.logInfo("Connection opened");
        this.retryCount = 0;
        this.emit("open");
      };

      this.ws.onmessage = (event) => {
        const msg = event.data;
        this.logInfo("Message received");
        this.emit("message", msg);
      };

      this.ws.onclose = (event) => {
        this.logInfo("Connection closed", { code: event.code });
        this.emit("close");

        if (event.code !== 4001 && this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = 1000 * Math.pow(2, this.retryCount);
          this.logInfo("Retrying connection", { retryCount: this.retryCount, maxRetries: this.maxRetries, delay });
          setTimeout(() => this.connect(), delay);
        } else if (event.code === 4001) {
          this.emit("auth_error", "Authentication failed");
        }
      };

      this.ws.onerror = (error) => {
        this.logError("WebSocket error occurred", { error });
        this.emit("error", new Error("WebSocket error occurred"));
      };
    } catch (error) {
      this.logError("Connection error", { error });
      if (error instanceof Error && error.message === "Not authenticated") {
        this.emit("auth_error", "Not authenticated");
      } else {
        this.emit(
          "error",
          error instanceof Error ? error : new Error("Connection failed")
        );
      }
    }
  }

  send(data: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.logError("Cannot send message - connection not open");
      this.emit("error", new Error("Connection not open"));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private logInfo(msg: string, extra?: Record<string, any>) {
    console.log(JSON.stringify({ level: "info", source: "WebSocketWrapper", msg, ...extra }));
  }

  private logError(msg: string, extra?: Record<string, any>) {
    console.error(JSON.stringify({ level: "error", source: "WebSocketWrapper", msg, ...extra }));
  }
}

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
    console.log("[WebSocket] Initializing with URL:", url);
    this.connect();
  }

  private async connect() {
    try {
      const sessionToken = await githubAuth.getSession();
      console.log(
        "[WebSocket] Got session token:",
        sessionToken ? "(token exists)" : "null"
      );
      if (!sessionToken) {
        throw new Error("Not authenticated");
      }

      const wsUrl = new URL(this.url);
      wsUrl.searchParams.append("session", sessionToken);
      console.log("[WebSocket] Connecting with URL:", wsUrl.toString());

      this.ws = new WebSocket(wsUrl.toString());

      this.ws.onopen = () => {
        console.log("[WebSocket] Connection opened");
        this.retryCount = 0;
        this.emit("open");
      };

      this.ws.onmessage = (event) => {
        const msg = event.data;
        console.log("[WebSocket] Message received");
        this.emit("message", msg);
      };

      this.ws.onclose = (event) => {
        console.log("[WebSocket] Connection closed with code:", event.code);
        this.emit("close");

        if (event.code !== 4001 && this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = 1000 * Math.pow(2, this.retryCount);
          console.log(
            `[WebSocket] Retrying connection (${this.retryCount}/${this.maxRetries}) in ${delay} ms`
          );
          setTimeout(() => this.connect(), delay);
        } else if (event.code === 4001) {
          this.emit("auth_error", "Authentication failed");
        }
      };

      this.ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
        this.emit("error", new Error("WebSocket error occurred"));
      };
    } catch (error) {
      console.error("[WebSocket] Connection error:", error);
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
      console.error("[WebSocket] Cannot send message - connection not open");
      this.emit("error", new Error("Connection not open"));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

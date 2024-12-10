class NostrWebSocketService {
  private socket: WebSocket | null = null;

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Ensure no existing connection is open
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.warn("WebSocket is already connected");
        resolve();
        return;
      }

      // Initialize the WebSocket
      this.socket = new WebSocket(url);

      if (!this.socket) {
        reject(new Error("Failed to initialize WebSocket instance"));
        return;
      }

      // Attach event listeners
      this.socket.onopen = () => resolve();
      this.socket.onerror = (error) => reject(error);
      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
  }

  sendEvent(event: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(["EVENT", event]));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  subscribe(subscriptionId: string, filters: any[]): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = ["REQ", subscriptionId, ...filters];
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  unsubscribe(subscriptionId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(["CLOSE", subscriptionId]));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  onMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        try {
          callback(JSON.parse(event.data));
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  }
}

export const nostrWebSocketService = new NostrWebSocketService();

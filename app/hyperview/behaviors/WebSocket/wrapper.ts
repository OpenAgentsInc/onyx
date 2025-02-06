type WebSocketEventHandler = (data: any) => void

export class WebSocketWrapper {
  private ws: WebSocket | null = null
  private messageQueue: string[] = []
  private retryCount = 0
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map()
  
  constructor(
    private url: string,
    private protocols?: string[]
  ) {
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url, this.protocols)
      
      this.ws.onopen = () => {
        this.retryCount = 0
        this.emit('open')
        this.flushMessageQueue()
      }
      
      this.ws.onclose = () => {
        this.emit('close')
        this.reconnect()
      }
      
      this.ws.onmessage = (event) => {
        this.emit('message', event.data)
      }
      
      this.ws.onerror = (error) => {
        this.emit('error', error)
      }
      
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.reconnect()
    }
  }

  private reconnect() {
    const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000)
    this.retryCount++
    
    setTimeout(() => {
      this.connect()
    }, delay)
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) this.send(message)
    }
  }

  public send(message: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message)
    } else {
      this.messageQueue.push(message)
    }
  }

  public close() {
    this.ws?.close()
    this.ws = null
  }

  public on(event: string, handler: WebSocketEventHandler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)?.push(handler)
  }

  private emit(event: string, data?: any) {
    this.eventHandlers.get(event)?.forEach(handler => handler(data))
  }
}
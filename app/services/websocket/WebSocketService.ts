import { makeAutoObservable } from "mobx"
import { WebSocketConfig, WebSocketMessage, ConnectionState, AskMessage, ResponseMessage, AuthMessage } from "./types"

export class WebSocketService {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private reconnectAttempts = 0
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map()
  
  state: ConnectionState = {
    connected: false,
    connecting: false
  }

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...config
    }
    makeAutoObservable(this)
  }

  connect = async () => {
    if (this.state.connected || this.state.connecting) return
    
    this.state.connecting = true
    
    try {
      this.ws = new WebSocket(this.config.url)
      
      this.ws.onopen = () => {
        // Send auth message when connection opens
        const authMessage: AuthMessage = {
          type: 'auth',
          id: Math.random().toString(36).substring(7),
          payload: {
            apiKey: this.config.apiKey || ''
          }
        }
        this.send(authMessage)
      }
      this.ws.onclose = this.handleClose
      this.ws.onerror = this.handleError
      this.ws.onmessage = this.handleMessage
      
    } catch (error) {
      this.state.error = `Connection failed: ${error.message || 'Unknown error'}`
      this.state.connecting = false
      this.attemptReconnect()
    }
  }

  private handleMessage = (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log('Received message:', message)

      // Handle auth response
      if (message.type === 'auth') {
        if (message.payload?.status === 'success') {
          this.state.connected = true
          this.state.connecting = false
          this.state.error = undefined
          this.reconnectAttempts = 0
        } else {
          this.state.error = message.payload?.error || 'Authentication failed'
          this.state.connecting = false
          this.ws?.close()
        }
        return
      }

      // Handle other messages
      const handler = this.messageHandlers.get(message.type)
      if (handler) {
        handler(message)
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error)
    }
  }

  private handleClose = (event: CloseEvent) => {
    const codes: Record<number, string> = {
      1000: "Normal closure",
      1001: "Going away",
      1002: "Protocol error",
      1003: "Unsupported data",
      1005: "No status received",
      1006: "Abnormal closure",
      1007: "Invalid frame payload data",
      1008: "Policy violation",
      1009: "Message too big",
      1010: "Mandatory extension",
      1011: "Internal server error",
      1015: "TLS handshake"
    }

    const reason = event.code in codes 
      ? `${codes[event.code]}${event.reason ? `: ${event.reason}` : ''}`
      : `Unknown error ${event.code}${event.reason ? `: ${event.reason}` : ''}`
      
    this.state.error = `Connection closed - ${reason}`
    this.state.connected = false
    this.attemptReconnect()
  }

  private handleError = (error: Event) => {
    let errorMessage = "WebSocket error occurred"
    if (error instanceof ErrorEvent) {
      errorMessage = `Connection error: ${error.message}`
    } else if (error instanceof CloseEvent) {
      errorMessage = `Connection closed${error.reason ? `: ${error.reason}` : ''}`
    }
    
    this.state.error = errorMessage
    this.state.connected = false
    this.attemptReconnect()
  }

  private attemptReconnect = () => {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5)) {
      this.state.error = "Max reconnection attempts reached"
      return
    }

    this.reconnectAttempts++
    setTimeout(() => {
      this.connect()
    }, this.config.reconnectInterval)
  }

  send = (message: WebSocketMessage) => {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected")
    }
    console.log('Sending message:', message)
    this.ws.send(JSON.stringify(message))
  }

  sendQuery = (query: string, teamId?: string) => {
    const message: AskMessage = {
      type: 'ask',
      id: Math.random().toString(36).substring(7),
      payload: {
        query,
        team_id: teamId
      }
    }
    this.send(message)
    return message.id
  }

  onMessage = (type: string, handler: (message: WebSocketMessage) => void) => {
    this.messageHandlers.set(type, handler)
    return () => this.messageHandlers.delete(type)
  }

  onResponse = (handler: (message: ResponseMessage) => void) => {
    return this.onMessage('response', handler as (message: WebSocketMessage) => void)
  }

  disconnect = () => {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.state.connected = false
    this.state.connecting = false
  }
}
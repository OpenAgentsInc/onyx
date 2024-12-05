import { makeAutoObservable } from "mobx"
import { WebSocketConfig, WebSocketMessage, ConnectionState, AskMessage, ResponseMessage } from "./types"

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
      
      // Add API key to headers if provided
      if (this.config.apiKey) {
        this.ws.setRequestHeader?.('x-api-key', this.config.apiKey)
      }
      
      this.ws.onopen = this.handleOpen
      this.ws.onclose = this.handleClose
      this.ws.onerror = this.handleError
      this.ws.onmessage = this.handleMessage
      
    } catch (error) {
      this.state.error = error.message
      this.state.connecting = false
      this.attemptReconnect()
    }
  }

  private handleOpen = () => {
    this.state.connected = true
    this.state.connecting = false
    this.state.error = undefined
    this.reconnectAttempts = 0
  }

  private handleClose = () => {
    this.state.connected = false
    this.attemptReconnect()
  }

  private handleError = (error: Event) => {
    this.state.error = "WebSocket error occurred"
    this.state.connected = false
    this.attemptReconnect()
  }

  private handleMessage = (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      const handler = this.messageHandlers.get(message.type)
      if (handler) {
        handler(message)
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error)
    }
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
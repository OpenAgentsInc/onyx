import { makeAutoObservable, runInAction } from "mobx"
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

  private setState(updates: Partial<ConnectionState>) {
    runInAction(() => {
      Object.assign(this.state, updates)
      console.log('State updated:', this.state)
    })
  }

  connect = async () => {
    if (this.state.connected || this.state.connecting) {
      console.log('Already connected or connecting, current state:', this.state)
      return
    }
    
    this.setState({ connecting: true })
    console.log('Connecting to WebSocket...')
    
    try {
      this.ws = new WebSocket(this.config.url)
      
      this.ws.onopen = () => {
        console.log('WebSocket connection opened, sending auth message')
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

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event)
        this.handleClose(event)
      }

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        this.handleError(event)
      }

      this.ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data)
        this.handleMessage(event)
      }
      
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.setState({
        error: `Connection failed: ${error.message || 'Unknown error'}`,
        connecting: false
      })
      this.attemptReconnect()
    }
  }

  private handleMessage = (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log('Parsed message:', message)

      // Handle auth response
      if (message.type === 'auth') {
        console.log('Handling auth response:', message)
        if (message.payload?.status === 'success') {
          console.log('Authentication successful')
          this.setState({
            connected: true,
            connecting: false,
            error: undefined
          })
          this.reconnectAttempts = 0
        } else {
          console.error('Authentication failed:', message.payload?.error)
          this.setState({
            error: message.payload?.error || 'Authentication failed',
            connecting: false,
            connected: false
          })
          this.ws?.close()
        }
        return
      }

      // Handle error messages
      if (message.type === 'error') {
        console.error('Received error message:', message)
        this.setState({
          error: message.payload?.error || 'Unknown error'
        })
        return
      }

      // Handle other messages
      console.log('Looking for handler for message type:', message.type)
      const handler = this.messageHandlers.get(message.type)
      if (handler) {
        console.log('Found handler for message type:', message.type)
        handler(message)
      } else {
        console.warn('No handler found for message type:', message.type)
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error, event.data)
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
      
    console.log('WebSocket closed:', reason)
    this.setState({
      error: `Connection closed - ${reason}`,
      connected: false,
      connecting: false
    })
    this.attemptReconnect()
  }

  private handleError = (error: Event) => {
    let errorMessage = "WebSocket error occurred"
    if (error instanceof ErrorEvent) {
      errorMessage = `Connection error: ${error.message}`
    } else if (error instanceof CloseEvent) {
      errorMessage = `Connection closed${error.reason ? `: ${error.reason}` : ''}`
    }
    
    console.error('WebSocket error:', errorMessage)
    this.setState({
      error: errorMessage,
      connected: false,
      connecting: false
    })
    this.attemptReconnect()
  }

  private attemptReconnect = () => {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5)) {
      console.log('Max reconnection attempts reached')
      this.setState({
        error: "Max reconnection attempts reached",
        connected: false,
        connecting: false
      })
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`)
    setTimeout(() => {
      this.connect()
    }, this.config.reconnectInterval)
  }

  send = (message: WebSocketMessage) => {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected')
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
    console.log('Registering handler for message type:', type)
    this.messageHandlers.set(type, handler)
    return () => this.messageHandlers.delete(type)
  }

  onResponse = (handler: (message: ResponseMessage) => void) => {
    return this.onMessage('response', handler as (message: WebSocketMessage) => void)
  }

  disconnect = () => {
    console.log('Disconnecting WebSocket')
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.setState({
      connected: false,
      connecting: false
    })
  }
}
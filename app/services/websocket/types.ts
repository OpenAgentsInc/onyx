export interface WebSocketMessage {
  type: string
  id: string
  payload: any
}

export interface AuthMessage extends WebSocketMessage {
  type: 'auth'
  payload: {
    pubkey: string
    signature: string
    challenge: string
  }
}

export interface CommandMessage extends WebSocketMessage {
  type: 'command'
  payload: {
    command: string
    args?: any
  }
}

export interface EventMessage extends WebSocketMessage {
  type: 'event'
  payload: {
    eventType: string
    data: any
  }
}

export interface WebSocketConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface ConnectionState {
  connected: boolean
  connecting: boolean
  error?: string
}
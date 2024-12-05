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

export interface AskRequest {
  query: string
  team_id?: string
}

export interface AskResponse {
  answer: string
  context?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface AskMessage extends WebSocketMessage {
  type: 'ask'
  payload: AskRequest
}

export interface ResponseMessage extends WebSocketMessage {
  type: 'response'
  payload: AskResponse
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
  apiKey?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface ConnectionState {
  connected: boolean
  connecting: boolean
  error?: string
}
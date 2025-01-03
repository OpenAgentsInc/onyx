export interface ProStatus {
  active: boolean
  plan: string
  features: string[]
}

export interface ShareRequest {
  recipient: string // Email or npub
  messages: any[] // Chat messages to share
  metadata?: {
    messageCount: number
    timestamp: number
    [key: string]: any
  }
}

export interface Share {
  id: string
  recipient: {
    id: string
    type: "email" | "npub"
    value: string
  }
  messages: any[]
  metadata?: {
    messageCount: number
    timestamp: number
    [key: string]: any
  }
  createdAt: string
}

export interface ShareResponse {
  shareId: string
  recipient: {
    id: string
    type: "email" | "npub" 
    value: string
  }
}

export interface SharesResponse {
  shares: Share[]
}

export interface TrainingDataRequest {
  messageIds: string[]
  optIn: boolean
}

export interface AiurConfig {
  url: string
  timeout: number
}
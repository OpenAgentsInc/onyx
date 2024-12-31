export interface ProStatus {
  active: boolean
  plan: string
  features: string[]
}

export interface ShareRequest {
  type: "user" | "public"
  recipientId?: string
  permissions: "read" | "write"
  trainingData: boolean
}

export interface Share {
  id: string
  type: "user" | "public"
  recipient?: {
    id: string
    username: string
  }
  permissions: "read" | "write"
  createdAt: string
  trainingData: boolean
}

export interface ShareResponse {
  shareId: string
  shareUrl?: string
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
export interface GroqConfig {
  apiKey: string
  baseURL?: string
  timeout?: number
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model: string
  temperature?: number
  max_tokens?: number
  top_p?: number
  stop?: string | string[]
  stream?: boolean
  response_format?: {
    type: "json_object"
  }
}

export interface ChatCompletionChoice {
  index: number
  message: ChatMessage
  finish_reason: string
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionChoice[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ChatCompletionStreamChoice {
  index: number
  delta: Partial<ChatMessage>
  finish_reason: string | null
}

export interface ChatCompletionStreamResponse {
  id: string
  object: string
  created: number
  model: string
  choices: ChatCompletionStreamChoice[]
}
export interface GroqConfig {
  apiKey: string
  baseURL?: string
  timeout?: number
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
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

export interface TranscriptionResponse {
  text: string
  x_groq: {
    id: string
  }
}

export interface TranscriptionConfig {
  model: string
  language?: string
  prompt?: string
  response_format?: "json" | "text" | "verbose_json"
  temperature?: number
  timestamp_granularities?: ("word" | "segment")[]
}
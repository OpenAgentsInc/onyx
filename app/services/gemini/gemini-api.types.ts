import type { ChatMessage, ChatCompletionResponse } from "../groq/groq-api.types"

export interface GeminiConfig {
  apiKey: string
  baseURL?: string
  timeout?: number
}

export interface GenerateContentConfig {
  temperature?: number
  maxOutputTokens?: number
  topP?: number
  topK?: number
}

// Using same response format as Groq for consistency
export type { ChatMessage, ChatCompletionResponse }
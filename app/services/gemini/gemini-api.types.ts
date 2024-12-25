import type { ChatMessage as GroqChatMessage, ChatCompletionResponse } from "../groq/groq-api.types"

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
  tools?: any[]
}

export interface FunctionDeclaration {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, {
      type: string
      description: string
    }>
    required: string[]
  }
}

export interface FunctionCall {
  name: string
  args: Record<string, unknown>
}

export interface ChatMessage {
  role: "user" | "model"
  content: string
}

// Using same response format as Groq for consistency
export { ChatCompletionResponse }
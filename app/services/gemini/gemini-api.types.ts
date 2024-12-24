export interface GeminiConfig {
  project: string
  location?: string
  model?: string
  timeout?: number
  apiKey: string
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
  tools?: Tool[]
}

export interface Tool {
  name: string
  description: string
  parameters: Record<string, unknown>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

export interface ToolCall {
  id: string
  name: string
  parameters: Record<string, unknown>
}

export interface ToolResponse {
  toolCallId: string
  result: unknown
}

export interface ChatCompletionChoice {
  message: ChatMessage
  finishReason: string
}

export interface ChatCompletionResponse {
  candidates: ChatCompletionChoice[]
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface GenerateContentConfig {
  temperature?: number
  maxOutputTokens?: number
  topP?: number
  topK?: number
  stopSequences?: string[]
  candidateCount?: number
  tools?: Tool[]
}
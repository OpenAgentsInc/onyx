export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
}

export interface OllamaCapability {
  available_models: string[];
  endpoint: string;
}
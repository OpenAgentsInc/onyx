import { WebSocketMessage } from './websocket';

export interface PromptArgument {
  name: string;
  description?: string;
  required: boolean;
}

export interface Prompt {
  name: string;
  description?: string;
  arguments: PromptArgument[];
}

export interface PromptMessage extends WebSocketMessage {
  method: 'prompts/get' | 'prompts/list';
  params: {
    name?: string;
    arguments?: Record<string, string>;
  };
}

export interface PromptResponse {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
}
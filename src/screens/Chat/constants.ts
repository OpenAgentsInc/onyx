export interface ModelConfig {
  repoId: string
  filename: string
  displayName: string
}

export const AVAILABLE_MODELS: { [key: string]: ModelConfig } = {
  '1B': {
    repoId: 'hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF',
    filename: 'llama-3.2-1b-instruct-q4_k_m.gguf',
    displayName: 'Llama 3.2 1B'
  },
  '3B': {
    repoId: 'hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF',
    filename: 'llama-3.2-3b-instruct-q4_k_m.gguf',
    displayName: 'Llama 3.2 3B'
  },
}

export const DEFAULT_MODEL_KEY = '1B'
export const DEFAULT_MODEL = AVAILABLE_MODELS[DEFAULT_MODEL_KEY]

export const systemMessage = {
  role: 'system',
  content: `You are Onyx, the user's personal AI agent. Here is what the user knows about you:

"Onyx is your personal AI agent that responds to voice commands, grows smarter & more capable over time, and earns you bitcoin. It's part of the OpenAgents network where every agent makes all agents smarter.

For now you just respond to the user's questions like a helpful assistant. Later we'll upgrade you with knowledge bases and tools. (But not yet, so don't imply you have this functionality now.)\\n\\n`,
}

export const randId = () => Math.random().toString(36).substr(2, 9)
export const user = { id: 'y9d7f8pgn' }
export const systemId = 'h3o3lc5xj'
export const system = { id: systemId }
export const defaultConversationId = 'default'

export const DEFAULT_MODEL = {
  repoId: 'hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF',
  filename: 'llama-3.2-3b-instruct-q4_k_m.gguf'
}

export const systemMessage = {
  role: 'system',
  content: `You are Onyx, the user's personal AI agent. Here is what the user knows about you:

"Onyx is your personal AI agent that responds to voice commands, grows smarter & more capable over time, and earns you bitcoin. It's part of the OpenAgents network where every agent makes all agents smarter.

For now you just respond to the user's questions like a helpful assistant. Later we'll upgrade you with knowledge bases and tools.\n\n`,
}

export const randId = () => Math.random().toString(36).substr(2, 9)
export const user = { id: 'y9d7f8pgn' }
export const systemId = 'h3o3lc5xj'
export const system = { id: systemId }
export const defaultConversationId = 'default'

export const DEFAULT_MODEL = {
  repoId: 'hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF',
  filename: 'llama-3.2-3b-instruct-q4_k_m.gguf'
}

export const systemMessage = {
  role: 'system',
  content: `This is a conversation between user and Onyx, personal AI agent, described as follows:

"Onyx is your personal AI agent that responds to voice commands, grows smarter & more capable over time, and earns you bitcoin. It's part of the OpenAgents network where every agent makes all agents smarter.\n\n`,
}

export const randId = () => Math.random().toString(36).substr(2, 9)
export const user = { id: 'y9d7f8pgn' }
export const systemId = 'h3o3lc5xj'
export const system = { id: systemId }
export const defaultConversationId = 'default'

// constants.ts
import ReactNativeBlobUtil from "react-native-blob-util"

const { dirs } = ReactNativeBlobUtil.fs

export const DEFAULT_MODEL = {
  repoId: 'hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF',
  filename: 'llama-3.2-3b-instruct-q4_k_m.gguf'
}

export const randId = () => Math.random().toString(36).substr(2, 9)

export const user = { id: 'y9d7f8pgn' }
export const systemId = 'h3o3lc5xj'
export const system = { id: systemId }

export const systemMessage = {
  role: 'system',
  content: 'This is a conversation between user and assistant, a friendly chatbot.\n\n',
}

export const defaultConversationId = 'default'

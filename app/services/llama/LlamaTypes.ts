import type { DocumentPickerResponse } from 'react-native-document-picker'
import type { MessageType } from '@flyerhq/react-native-chat-ui'

export interface LlamaContext {
  id: string
  gpu: boolean
  reasonNoGPU: string
  model: {
    isChatTemplateSupported: boolean
  }
  release: () => Promise<void>
  bench: (n1: number, n2: number, n3: number, n4: number) => Promise<{
    modelDesc: string
    modelSize: number
    modelNParams: number
    ppAvg: number
    ppStd: number
    tgAvg: number
    tgStd: number
  }>
  stopCompletion: () => void
  saveSession: (path: string) => Promise<number>
  loadSession: (path: string) => Promise<{ tokens_loaded: number }>
  applyLoraAdapters: (adapters: { path: string }[]) => Promise<void>
  getLoadedLoraAdapters: () => Promise<any[]>
  removeLoraAdapters: () => Promise<void>
  getFormattedChat: (messages: any[]) => Promise<string>
  tokenize: (text: string) => Promise<{ tokens: number[] }>
  completion: (params: any, callback: (data: { token: string }) => void) => Promise<{
    timings: {
      predicted_per_token_ms: number
      predicted_per_second: number
    }
  }>
}

export interface ChatMessage extends MessageType.Text {
  metadata?: {
    system?: boolean
    copyable?: boolean
    contextId?: string
    conversationId?: string
    timings?: string
  }
}

export interface ChatUser {
  id: string
}
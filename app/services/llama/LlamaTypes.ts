import type { LlamaContext as NativeLlamaContext } from "llama.rn"
import type { CompletionParams, TokenData, NativeCompletionResult, NativeTokenizeResult, NativeSessionLoadResult, EmbeddingParams, NativeEmbeddingResult } from "llama.rn"

export interface BenchResult {
  modelDesc: string
  modelSize: number
  modelNParams: number
  ppAvg: number
  ppStd: number
  tgAvg: number
  tgStd: number
}

export interface RNLlamaOAICompatibleMessage {
  role: string
  content: string
}

export class LlamaContext {
  id: number
  gpu: boolean = false
  reasonNoGPU: string = ''
  model: {
    isChatTemplateSupported?: boolean
  } = {}

  constructor({ contextId, gpu, reasonNoGPU, model }: NativeLlamaContext) {
    this.id = contextId
    this.gpu = gpu
    this.reasonNoGPU = reasonNoGPU
    this.model = model
  }

  async loadSession(filepath: string): Promise<NativeSessionLoadResult> {
    throw new Error("Not implemented")
  }

  async saveSession(filepath: string, options?: { tokenSize: number }): Promise<number> {
    throw new Error("Not implemented")
  }

  async getFormattedChat(messages: RNLlamaOAICompatibleMessage[], template?: string): Promise<string> {
    throw new Error("Not implemented")
  }

  async completion(params: CompletionParams, callback?: (data: TokenData) => void): Promise<NativeCompletionResult> {
    throw new Error("Not implemented")
  }

  async stopCompletion(): Promise<void> {
    throw new Error("Not implemented")
  }

  async tokenize(text: string): Promise<NativeTokenizeResult> {
    throw new Error("Not implemented")
  }

  async detokenize(tokens: number[]): Promise<string> {
    throw new Error("Not implemented")
  }

  async embedding(text: string, params?: EmbeddingParams): Promise<NativeEmbeddingResult> {
    throw new Error("Not implemented")
  }

  async bench(pp: number, tg: number, pl: number, nr: number): Promise<BenchResult> {
    throw new Error("Not implemented")
  }

  async applyLoraAdapters(loraList: Array<{ path: string; scaled?: number }>): Promise<void> {
    throw new Error("Not implemented")
  }

  async removeLoraAdapters(): Promise<void> {
    throw new Error("Not implemented")
  }

  async getLoadedLoraAdapters(): Promise<Array<{ path: string; scaled?: number }>> {
    throw new Error("Not implemented")
  }

  async release(): Promise<void> {
    throw new Error("Not implemented")
  }
}
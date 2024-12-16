import type { LlamaContext as NativeLlamaContext } from "llama.rn"
import type { CompletionParams, TokenData, NativeCompletionResult, NativeTokenizeResult, NativeSessionLoadResult, EmbeddingParams, NativeEmbeddingResult } from "llama.rn"
import RNLlama from "llama.rn"

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
    let path = filepath
    if (path.startsWith('file://')) path = path.slice(7)
    return RNLlama.loadSession(this.id, path)
  }

  async saveSession(filepath: string, options?: { tokenSize: number }): Promise<number> {
    return RNLlama.saveSession(this.id, filepath, options?.tokenSize || -1)
  }

  async getFormattedChat(messages: RNLlamaOAICompatibleMessage[], template?: string): Promise<string> {
    return RNLlama.getFormattedChat(this.id, messages, template)
  }

  async completion(params: CompletionParams, callback?: (data: TokenData) => void): Promise<NativeCompletionResult> {
    let finalPrompt = params.prompt
    if (params.messages) {
      finalPrompt = await this.getFormattedChat(params.messages, params.chatTemplate)
    }

    if (!finalPrompt) throw new Error('Prompt is required')
    return RNLlama.completion(this.id, {
      ...params,
      prompt: finalPrompt,
      emit_partial_completion: !!callback,
    })
  }

  async stopCompletion(): Promise<void> {
    return RNLlama.stopCompletion(this.id)
  }

  async tokenize(text: string): Promise<NativeTokenizeResult> {
    return RNLlama.tokenize(this.id, text)
  }

  async detokenize(tokens: number[]): Promise<string> {
    return RNLlama.detokenize(this.id, tokens)
  }

  async embedding(text: string, params?: EmbeddingParams): Promise<NativeEmbeddingResult> {
    return RNLlama.embedding(this.id, text, params || {})
  }

  async bench(pp: number, tg: number, pl: number, nr: number): Promise<BenchResult> {
    const result = await RNLlama.bench(this.id, pp, tg, pl, nr)
    const [modelDesc, modelSize, modelNParams, ppAvg, ppStd, tgAvg, tgStd] = JSON.parse(result)
    return {
      modelDesc,
      modelSize,
      modelNParams,
      ppAvg,
      ppStd,
      tgAvg,
      tgStd,
    }
  }

  async applyLoraAdapters(loraList: Array<{ path: string; scaled?: number }>): Promise<void> {
    let loraAdapters: Array<{ path: string; scaled?: number }> = []
    if (loraList)
      loraAdapters = loraList.map((l) => ({
        path: l.path.replace(/file:\/\//, ''),
        scaled: l.scaled,
      }))
    return RNLlama.applyLoraAdapters(this.id, loraAdapters)
  }

  async removeLoraAdapters(): Promise<void> {
    return RNLlama.removeLoraAdapters(this.id)
  }

  async getLoadedLoraAdapters(): Promise<Array<{ path: string; scaled?: number }>> {
    return RNLlama.getLoadedLoraAdapters(this.id)
  }

  async release(): Promise<void> {
    return RNLlama.releaseContext(this.id)
  }
}
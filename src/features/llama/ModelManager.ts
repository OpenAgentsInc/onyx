import type { LlamaContext } from 'llama.rn'
import { initLlama, loadLlamaModelInfo } from "llama.rn"
import { Platform } from "react-native"

import type { DocumentPickerResponse } from 'react-native-document-picker'

export type InitProgressCallback = (progress: number) => void
export type ModelInitResult = {
  context: LlamaContext
  loadTimeMs: number
}

export class ModelManager {
  async getModelInfo(modelPath: string) {
    const t0 = Date.now()
    const info = await loadLlamaModelInfo(modelPath)
    return {
      info,
      loadTimeMs: Date.now() - t0
    }
  }

  async initializeModel(
    modelFile: DocumentPickerResponse,
    loraFile: DocumentPickerResponse | null,
    onProgress?: InitProgressCallback
  ): Promise<ModelInitResult> {
    const startTime = Date.now()

    const context = await initLlama(
      {
        model: modelFile.uri,
        use_mlock: true,
        n_gpu_layers: Platform.OS === 'ios' ? 99 : 0, // > 0: enable GPU
        lora_list: loraFile ? [{ path: loraFile.uri, scaled: 1.0 }] : undefined,
      },
      onProgress
    )

    return {
      context,
      loadTimeMs: Date.now() - startTime
    }
  }
}

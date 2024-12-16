import { Platform } from 'react-native'
import { initLlama, loadLlamaModelInfo, releaseAllContexts } from 'llama.rn'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import type { LlamaContext } from './LlamaTypes'

export const getModelInfo = async (model: string) => {
  const t0 = Date.now()
  const info = await loadLlamaModelInfo(model)
  console.log(`Model info (took ${Date.now() - t0}ms): `, info)
  return info
}

export const initializeLlamaContext = async (
  file: DocumentPickerResponse,
  loraFile: DocumentPickerResponse | null,
  onProgress: (progress: number) => void
): Promise<LlamaContext> => {
  // First, release all existing contexts
  try {
    await releaseAllContexts()
  } catch (err) {
    console.warn("Failed to release contexts:", err)
  }

  // Then initialize new context
  return initLlama(
    {
      model: file.uri,
      use_mlock: true,
      n_gpu_layers: Platform.OS === 'ios' ? 99 : 0, // > 0: enable GPU
      lora_list: loraFile ? [{ path: loraFile.uri, scaled: 1.0 }] : undefined,
      n_ctx: 2048, // Context window
      n_batch: 512, // Batch size for prompt processing
      n_threads: Math.min(6, Platform.OS === 'ios' ? 6 : 4), // Fewer threads on Android
    },
    onProgress
  )
}

export const handleContextRelease = async (
  context: LlamaContext | null,
  onRelease: () => void,
  onError: (error: any) => void
) => {
  if (!context) return
  try {
    await context.release()
    await releaseAllContexts() // Make sure all contexts are released
    onRelease()
  } catch (err) {
    onError(err)
  }
}
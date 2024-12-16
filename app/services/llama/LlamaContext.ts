import { DocumentPickerResponse } from 'react-native-document-picker'
import { LlamaContext } from './LlamaTypes'
import RNLlama from 'llama.rn'

export const getModelInfo = async (modelPath: string) => {
  return RNLlama.getModelInfo(modelPath)
}

export const initializeLlamaContext = async (
  modelFile: DocumentPickerResponse,
  options: any,
  progressCallback: (progress: number) => void,
): Promise<LlamaContext> => {
  const ctx = await RNLlama.initContext(modelFile.uri, {
    n_ctx: 2048,
    n_batch: 512,
    n_threads: 6,
    n_gpu_layers: 99,
    ...options,
  }, progressCallback)

  return new LlamaContext(ctx)
}

export const handleContextRelease = async (
  context: LlamaContext | null,
  onSuccess: () => void,
  onError: (err: any) => void,
) => {
  if (!context) return
  try {
    await context.release()
    onSuccess()
  } catch (err) {
    onError(err)
  }
}
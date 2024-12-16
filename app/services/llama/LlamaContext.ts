import { initLlama, loadLlamaModelInfo } from "llama.rn"
import { Platform } from "react-native"
import React, { createContext, useContext } from 'react'
import { useLlamaVercelChat } from '@/hooks/useLlamaVercelChat'

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
  return initLlama(
    {
      model: file.uri,
      use_mlock: true,
      n_gpu_layers: Platform.OS === 'ios' ? 99 : 0, // > 0: enable GPU
      lora_list: loraFile ? [{ path: loraFile.uri, scaled: 1.0 }] : undefined,
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
    onRelease()
  } catch (err) {
    onError(err)
  }
}

// React Context for Llama
type LlamaContextType = ReturnType<typeof useLlamaVercelChat>
const LlamaReactContext = createContext<LlamaContextType | null>(null)

export function LlamaProvider({ children }: { children: React.ReactNode }) {
  const llamaChat = useLlamaVercelChat()
  
  return (
    <LlamaReactContext.Provider value={llamaChat}>
      {children}
    </LlamaReactContext.Provider>
  )
}

export function useLlamaContext() {
  const context = useContext(LlamaReactContext)
  if (!context) {
    throw new Error('useLlamaContext must be used within a LlamaProvider')
  }
  return context
}
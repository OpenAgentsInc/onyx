import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AVAILABLE_MODELS, DEFAULT_MODEL_KEY, ModelConfig } from '../screens/Chat/constants'

export type ModelStatus = 'idle' | 'downloading' | 'initializing' | 'ready' | 'error'

interface ModelState {
  selectedModelKey: string
  status: ModelStatus
  progress: number
  modelPath: string | null
  errorMessage: string | null
  downloadCancelled: boolean
}

interface ModelActions {
  selectModel: (modelKey: string) => void
  startDownload: () => void
  updateProgress: (progress: number) => void
  setModelPath: (path: string) => void
  startInitialization: () => void
  setReady: () => void
  setError: (message: string) => void
  cancelDownload: () => void
  reset: () => void
}

const initialState: ModelState = {
  selectedModelKey: DEFAULT_MODEL_KEY,
  status: 'idle',
  progress: 0,
  modelPath: null,
  errorMessage: null,
  downloadCancelled: false,
}

export const useModelStore = create<ModelState & ModelActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectModel: (modelKey: string) => {
        if (!AVAILABLE_MODELS[modelKey]) {
          console.error('Invalid model key:', modelKey)
          return
        }
        set({
          selectedModelKey: modelKey,
          status: 'idle',
          progress: 0,
          modelPath: null,
          errorMessage: null,
          downloadCancelled: false,
        })
      },

      startDownload: () => {
        set({
          status: 'downloading',
          progress: 0,
          errorMessage: null,
          downloadCancelled: false,
        })
      },

      updateProgress: (progress: number) => {
        // Only update progress if we're still downloading and not cancelled
        if (get().status === 'downloading' && !get().downloadCancelled) {
          set({ progress })
        }
      },

      setModelPath: (path: string) => {
        set({ modelPath: path })
      },

      startInitialization: () => {
        set({ status: 'initializing', progress: 100 })
      },

      setReady: () => {
        set({ status: 'ready', errorMessage: null })
      },

      setError: (message: string) => {
        set({
          status: 'error',
          errorMessage: message,
          downloadCancelled: true,
        })
      },

      cancelDownload: () => {
        set({
          downloadCancelled: true,
          status: 'idle',
          progress: 0,
          errorMessage: 'Download cancelled',
        })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'onyx-model-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedModelKey: state.selectedModelKey,
        modelPath: state.modelPath,
      }),
    }
  )
)

// Helper function to get current model config
export const getCurrentModelConfig = (): ModelConfig => {
  const { selectedModelKey } = useModelStore.getState()
  return AVAILABLE_MODELS[selectedModelKey]
}
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
  needsInitialization: boolean // New flag to trigger initialization after model switch
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
  needsInitialization: true,
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
        // When switching models, reset state and set needsInitialization
        set({
          selectedModelKey: modelKey,
          status: 'idle',
          progress: 0,
          modelPath: null,
          errorMessage: null,
          downloadCancelled: false,
          needsInitialization: true,
        })
      },

      startDownload: () => {
        const { status } = get()
        // Only start download if we're idle or in error state
        if (status === 'idle' || status === 'error') {
          set({
            status: 'downloading',
            progress: 0,
            errorMessage: null,
            downloadCancelled: false,
          })
        }
      },

      updateProgress: (progress: number) => {
        const { status, downloadCancelled } = get()
        // Only update progress if we're still downloading and not cancelled
        if (status === 'downloading' && !downloadCancelled) {
          set({ progress })
        }
      },

      setModelPath: (path: string) => {
        set({ modelPath: path })
      },

      startInitialization: () => {
        const { status } = get()
        // Only start initialization if we're in downloading state
        if (status === 'downloading') {
          set({ status: 'initializing', progress: 100 })
        }
      },

      setReady: () => {
        set({ 
          status: 'ready', 
          errorMessage: null,
          needsInitialization: false 
        })
      },

      setError: (message: string) => {
        set({
          status: 'error',
          errorMessage: message,
          downloadCancelled: true,
          needsInitialization: true,
        })
      },

      cancelDownload: () => {
        set({
          downloadCancelled: true,
          status: 'idle',
          progress: 0,
          errorMessage: 'Download cancelled',
          needsInitialization: true,
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
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AVAILABLE_MODELS, DEFAULT_MODEL_KEY, ModelConfig } from '../screens/Chat/constants'

export type ModelStatus = 'idle' | 'downloading' | 'initializing' | 'ready' | 'error' | 'releasing'

interface ModelState {
  selectedModelKey: string
  status: ModelStatus
  progress: number
  modelPath: string | null
  errorMessage: string | null
  downloadCancelled: boolean
  needsInitialization: boolean
  initializationAttempts: number
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
  startReleasing: () => void
  deleteModel: (modelKey: string) => void
}

const initialState: ModelState = {
  selectedModelKey: DEFAULT_MODEL_KEY,
  status: 'idle',
  progress: 0,
  modelPath: null,
  errorMessage: null,
  downloadCancelled: false,
  needsInitialization: true,
  initializationAttempts: 0,
}

const MAX_INIT_ATTEMPTS = 1 // Only try initialization once

export const useModelStore = create<ModelState & ModelActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectModel: (modelKey: string) => {
        if (!AVAILABLE_MODELS[modelKey]) {
          console.error('Invalid model key:', modelKey)
          return
        }
        console.log('Selecting model:', modelKey)
        // When switching models, first set status to releasing
        set({
          selectedModelKey: modelKey,
          status: 'releasing',
          progress: 0,
          modelPath: null,
          errorMessage: null,
          downloadCancelled: false,
          needsInitialization: true,
          initializationAttempts: 0,
        })
      },

      startReleasing: () => {
        console.log('Starting model release')
        set({ status: 'releasing' })
      },

      startDownload: () => {
        const { status } = get()
        console.log('Starting download, current status:', status)
        // Only start download if we're idle or in error state
        if (status === 'idle' || status === 'error') {
          set({
            status: 'downloading',
            progress: 0,
            errorMessage: null,
            downloadCancelled: false,
            initializationAttempts: 0,
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
        console.log('Setting model path:', path)
        set({ modelPath: path })
      },

      startInitialization: () => {
        const { status, initializationAttempts } = get()
        console.log('Starting initialization, current status:', status, 'attempts:', initializationAttempts)
        
        // Check if we've exceeded max attempts
        if (initializationAttempts >= MAX_INIT_ATTEMPTS) {
          set({ 
            status: 'error',
            errorMessage: 'Not enough memory to initialize model. Try the 1B model instead.',
            needsInitialization: true,
          })
          return
        }

        // Can start initialization from downloading or releasing state
        if (status === 'downloading' || status === 'releasing' || status === 'idle') {
          set({ 
            status: 'initializing', 
            progress: 100,
            initializationAttempts: initializationAttempts + 1,
          })
        }
      },

      setReady: () => {
        console.log('Setting model ready')
        set({ 
          status: 'ready', 
          errorMessage: null,
          needsInitialization: false,
          initializationAttempts: 0,
        })
      },

      setError: (message: string) => {
        console.error('Model error:', message)
        // Check if it's a context limit error
        const isContextError = message.toLowerCase().includes('context limit')
        set({
          status: 'error',
          errorMessage: isContextError 
            ? 'Not enough memory to initialize model. Try the 1B model instead.'
            : message,
          downloadCancelled: true,
          needsInitialization: true,
        })
      },

      cancelDownload: () => {
        console.log('Cancelling download')
        set({
          downloadCancelled: true,
          status: 'idle',
          progress: 0,
          errorMessage: 'Download cancelled',
          needsInitialization: true,
          initializationAttempts: 0,
        })
      },

      reset: () => {
        console.log('Resetting store to idle state')
        set({
          ...initialState,
          selectedModelKey: get().selectedModelKey, // Keep the selected model
          status: 'idle',
          needsInitialization: true,
          initializationAttempts: 0,
        })
      },

      deleteModel: (modelKey: string) => {
        const { selectedModelKey, status } = get()
        console.log('Deleting model:', modelKey)
        
        // If deleting active model, release it first
        if (modelKey === selectedModelKey && status === 'ready') {
          set({
            status: 'releasing',
            modelPath: null,
            needsInitialization: true,
            initializationAttempts: 0,
          })
        }
      },
    }),
    {
      name: 'onyx-model-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedModelKey: state.selectedModelKey,
        modelPath: state.modelPath,
      }),
      onRehydrateStorage: () => (state) => {
        // When store rehydrates, set to idle state needing initialization
        if (state) {
          console.log('Store rehydrated:', state)
          state.status = 'idle'
          state.needsInitialization = true
          state.initializationAttempts = 0
        }
      }
    }
  )
)

// Helper function to get current model config
export const getCurrentModelConfig = (): ModelConfig => {
  const { selectedModelKey } = useModelStore.getState()
  return AVAILABLE_MODELS[selectedModelKey]
}
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
  lastDeletedModel: string | null // Track last deleted model
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
  confirmDeletion: (modelKey: string) => void
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
  lastDeletedModel: null,
}

const MAX_INIT_ATTEMPTS = 1 // Only try initialization once

// Helper to extract model key from path
const getModelKeyFromPath = (path: string | null): string | null => {
  if (!path) return null
  for (const [key, model] of Object.entries(AVAILABLE_MODELS)) {
    if (path.includes(model.filename)) {
      return key
    }
  }
  return null
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
        const { selectedModelKey } = get()
        console.log(`[Model Release] Starting release of model: ${selectedModelKey}`)
        set({ 
          status: 'releasing',
          needsInitialization: true,
          initializationAttempts: 0,
        })
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
            needsInitialization: true,
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
        // When setting model path, update selected model key if needed
        const modelKey = getModelKeyFromPath(path)
        if (modelKey) {
          set({ 
            modelPath: path,
            selectedModelKey: modelKey,
            status: 'initializing',
            initializationAttempts: 0,
          })
        } else {
          console.error('Could not determine model key from path:', path)
          set({ 
            modelPath: path,
            status: 'initializing',
            initializationAttempts: 0,
          })
        }
      },

      startInitialization: () => {
        const { status, initializationAttempts, selectedModelKey } = get()
        console.log('Starting initialization, current status:', status, 'attempts:', initializationAttempts)
        
        // Check if we've exceeded max attempts
        if (initializationAttempts >= MAX_INIT_ATTEMPTS) {
          const currentModel = AVAILABLE_MODELS[selectedModelKey]
          const suggestion = selectedModelKey === '1B' 
            ? 'Please try again or contact support if the issue persists.'
            : 'Try the 1B model instead.'
          
          set({ 
            status: 'error',
            errorMessage: `Not enough memory to initialize ${currentModel.displayName}. ${suggestion}`,
            needsInitialization: true,
          })
          return
        }

        // Can start initialization from any state if we have a model path
        if (get().modelPath) {
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
        const { selectedModelKey, status } = get()
        const currentModel = AVAILABLE_MODELS[selectedModelKey]
        
        // Check if it's a context limit error
        const isContextError = message.toLowerCase().includes('context limit')
        const suggestion = selectedModelKey === '1B' 
          ? 'Please try again or contact support if the issue persists.'
          : 'Try the 1B model instead.'
        
        set({
          status: 'error',
          errorMessage: isContextError 
            ? `Not enough memory to initialize ${currentModel.displayName}. ${suggestion}`
            : message,
          downloadCancelled: status === 'downloading', // Only set for download errors
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
        const { modelPath } = get()
        // If we have a model path, try to determine the correct model key
        const modelKey = modelPath ? getModelKeyFromPath(modelPath) : get().selectedModelKey
        
        set({
          ...initialState,
          selectedModelKey: modelKey || get().selectedModelKey,
          modelPath, // Keep the model path
          status: modelPath ? 'initializing' : 'idle',
          needsInitialization: true,
          initializationAttempts: 0,
        })
      },

      deleteModel: (modelKey: string) => {
        const { selectedModelKey, status } = get()
        console.log(`[Model Delete] Starting deletion of model: ${modelKey}`)
        console.log(`[Model Delete] Current state - Selected: ${selectedModelKey}, Status: ${status}`)
        
        // If deleting active model, release it first
        if (modelKey === selectedModelKey && status === 'ready') {
          console.log(`[Model Delete] Releasing active model context before deletion: ${modelKey}`)
          set({
            status: 'releasing',
            modelPath: null,
            needsInitialization: true,
            initializationAttempts: 0,
            lastDeletedModel: modelKey,
          })
        } else {
          console.log(`[Model Delete] Deleting inactive model: ${modelKey}`)
          // For inactive models, just mark as deleted
          set({ lastDeletedModel: modelKey })
        }
      },

      confirmDeletion: (modelKey: string) => {
        console.log(`[Model Delete] Confirming deletion of model: ${modelKey}`)
        const { selectedModelKey, status } = get()
        
        // If this was the active model and we're in releasing state, reset
        if (modelKey === selectedModelKey && status === 'releasing') {
          console.log(`[Model Delete] Active model ${modelKey} released and deleted`)
          set({
            status: 'idle',
            modelPath: null,
            needsInitialization: true,
            initializationAttempts: 0,
            lastDeletedModel: null,
          })
        } else {
          console.log(`[Model Delete] Inactive model ${modelKey} deleted`)
          set({ lastDeletedModel: null })
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
        // When store rehydrates, determine correct model key from path
        if (state) {
          console.log('Store rehydrated:', state)
          const modelKey = getModelKeyFromPath(state.modelPath)
          if (modelKey && modelKey !== state.selectedModelKey) {
            state.selectedModelKey = modelKey
          }
          state.status = state.modelPath ? 'initializing' : 'idle'
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
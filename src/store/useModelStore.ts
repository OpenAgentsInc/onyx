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
  isInitializing: boolean
}

interface ModelActions {
  selectModel: (modelKey: string) => void
  startDownload: () => void
  updateProgress: (progress: number) => void
  setModelPath: (path: string) => void
  startInitialization: () => void
  setReady: () => void
  setError: (message: string) => void
  setIdle: () => void
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
  isInitializing: false,
}

const logState = (action: string, state: ModelState) => {
  console.log(`[Store ${action}] Status: ${state.status}, Path: ${state.modelPath}, IsInit: ${state.isInitializing}`)
}

export const useModelStore = create<ModelState & ModelActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectModel: (modelKey: string) => {
        if (!AVAILABLE_MODELS[modelKey]) {
          console.error('[Store] Invalid model key:', modelKey)
          return
        }
        console.log('[Store] Selecting model:', modelKey)
        set({
          selectedModelKey: modelKey,
          status: 'releasing',
          progress: 0,
          modelPath: null,
          errorMessage: null,
          downloadCancelled: false,
          isInitializing: false,
        })
        logState('selectModel', get())
      },

      startReleasing: () => {
        console.log('[Store] Starting release')
        set({ 
          status: 'releasing',
          isInitializing: false,
        })
        logState('startReleasing', get())
      },

      startDownload: () => {
        const { status } = get()
        console.log('[Store] Starting download, current status:', status)
        if (status === 'idle' || status === 'error') {
          set({
            status: 'downloading',
            progress: 0,
            errorMessage: null,
            downloadCancelled: false,
            isInitializing: false,
          })
          logState('startDownload', get())
        }
      },

      updateProgress: (progress: number) => {
        const { status, downloadCancelled } = get()
        if (status === 'downloading' && !downloadCancelled) {
          set({ progress })
        }
      },

      setModelPath: (path: string) => {
        console.log('[Store] Setting model path:', path)
        const modelKey = getModelKeyFromPath(path)
        if (modelKey) {
          set({ 
            modelPath: path,
            selectedModelKey: modelKey,
            status: 'initializing',
            isInitializing: false,
          })
        } else {
          console.error('[Store] Could not determine model key from path:', path)
          set({ 
            modelPath: path,
            status: 'initializing',
            isInitializing: false,
          })
        }
        logState('setModelPath', get())
      },

      startInitialization: () => {
        console.log('[Store] Starting initialization')
        set({ 
          status: 'initializing', 
          progress: 100,
          isInitializing: false, // Let the hook control this
          errorMessage: null,
        })
        logState('startInitialization', get())
      },

      setReady: () => {
        console.log('[Store] Setting ready')
        set({ 
          status: 'ready', 
          errorMessage: null,
          isInitializing: false,
        })
        logState('setReady', get())
      },

      setIdle: () => {
        console.log('[Store] Setting idle')
        set({
          ...initialState,
          selectedModelKey: get().selectedModelKey,
        })
        logState('setIdle', get())
      },

      setError: (message: string) => {
        console.error('[Store] Error:', message)
        const { selectedModelKey, status } = get()
        const currentModel = AVAILABLE_MODELS[selectedModelKey]
        
        const isContextError = message.toLowerCase().includes('context limit')
        const suggestion = selectedModelKey === '1B' 
          ? 'Please try again or contact support if the issue persists.'
          : 'Try the 1B model instead.'
        
        set({
          status: 'error',
          errorMessage: isContextError 
            ? `Not enough memory to initialize ${currentModel.displayName}. ${suggestion}`
            : message,
          downloadCancelled: status === 'downloading',
          isInitializing: false,
          modelPath: null,
        })
        logState('setError', get())
      },

      cancelDownload: () => {
        console.log('[Store] Cancelling download')
        set({
          downloadCancelled: true,
          status: 'idle',
          progress: 0,
          errorMessage: 'Download cancelled',
          isInitializing: false,
        })
        logState('cancelDownload', get())
      },

      reset: () => {
        console.log('[Store] Resetting store')
        set({
          ...initialState,
          selectedModelKey: get().selectedModelKey,
          modelPath: null,
          status: 'idle',
          isInitializing: false,
        })
        logState('reset', get())
      },

      deleteModel: (modelKey: string) => {
        const { selectedModelKey, status } = get()
        console.log(`[Store] Starting deletion of model: ${modelKey}`)
        
        if (modelKey === selectedModelKey && status === 'ready') {
          set({
            status: 'releasing',
            modelPath: null,
            isInitializing: false,
          })
        }
        logState('deleteModel', get())
      },

      confirmDeletion: (modelKey: string) => {
        console.log(`[Store] Confirming deletion: ${modelKey}`)
        const { selectedModelKey, status } = get()
        
        if (modelKey === selectedModelKey && status === 'releasing') {
          set({
            ...initialState,
            selectedModelKey,
          })
        }
        logState('confirmDeletion', get())
      },
    }),
    {
      name: 'onyx-model-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedModelKey: state.selectedModelKey,
        modelPath: state.modelPath,
        status: state.status === 'ready' ? 'initializing' : 'idle', // Convert ready to initializing on save
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('[Store] Rehydrated:', state)
          // If we have a model path, set to initializing state
          if (state.modelPath) {
            state.status = 'initializing'
            state.isInitializing = false // Let the hook control this
            state.progress = 0
            state.errorMessage = null
            state.downloadCancelled = false
          } else {
            state.status = 'idle'
            state.isInitializing = false
          }
          logState('rehydrate', state)
        }
      }
    }
  )
)

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

// Helper function to get current model config
export const getCurrentModelConfig = (): ModelConfig => {
  const { selectedModelKey } = useModelStore.getState()
  return AVAILABLE_MODELS[selectedModelKey]
}
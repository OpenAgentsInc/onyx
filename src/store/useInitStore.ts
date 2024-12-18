import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { serviceManager } from '../services/ServiceManager'

interface InitState {
  isInitialized: boolean
  isInitializing: boolean
  errorMessage: string | null
}

interface InitActions {
  initialize: () => Promise<void>
  reset: () => void
}

const initialState: InitState = {
  isInitialized: false,
  isInitializing: false,
  errorMessage: null,
}

export const useInitStore = create<InitState & InitActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      initialize: async () => {
        if (get().isInitializing || get().isInitialized) return
        
        set({ isInitializing: true, errorMessage: null })
        
        try {
          await serviceManager.initializeServices()
          set({ isInitialized: true, errorMessage: null })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error during initialization'
          set({ errorMessage: message })
          throw error
        } finally {
          set({ isInitializing: false })
        }
      },

      reset: () => {
        serviceManager.reset().catch(console.error)
        set(initialState)
      }
    }),
    {
      name: 'onyx-init-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        errorMessage: state.errorMessage
      })
    }
  )
)
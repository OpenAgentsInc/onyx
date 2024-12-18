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
        console.log('InitStore: Starting initialization...')
        if (get().isInitializing || get().isInitialized) {
          console.log('InitStore: Already initializing or initialized')
          return
        }
        
        set({ isInitializing: true, errorMessage: null })
        
        try {
          console.log('InitStore: Calling ServiceManager.initializeServices()')
          await serviceManager.initializeServices()
          console.log('InitStore: Services initialized successfully')
          set({ isInitialized: true, errorMessage: null })
        } catch (error) {
          console.error('InitStore: Initialization error:', error)
          const message = error instanceof Error ? error.message : 'Unknown error during initialization'
          set({ errorMessage: message })
          throw error
        } finally {
          set({ isInitializing: false })
        }
      },

      reset: () => {
        console.log('InitStore: Resetting...')
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
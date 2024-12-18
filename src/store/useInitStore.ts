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
        if (get().isInitializing) {
          console.log('InitStore: Already initializing')
          return
        }
        
        // Even if isInitialized is true, we need to reinitialize services
        // because they don't persist their state
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
      }),
      // When store is hydrated from storage, we need to initialize services
      onRehydrateStorage: () => (state) => {
        console.log('InitStore: Rehydrated from storage, state:', state)
        if (state?.isInitialized) {
          console.log('InitStore: Was initialized, reinitializing services...')
          // Need to initialize services even if we were previously initialized
          serviceManager.initializeServices().catch(error => {
            console.error('InitStore: Error reinitializing services after rehydration:', error)
          })
        }
      }
    }
  )
)
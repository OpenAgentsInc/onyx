import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { storage } from '../services/storage'
import { serviceManager } from '../services/ServiceManager'

interface InitState {
  isInitialized: boolean
  isInitializing: boolean
  errorMessage: string | null
}

interface InitActions {
  initialize: () => Promise<void>
  reset: () => void
  setInitialized: (value: boolean) => void
}

const initialState: InitState = {
  isInitialized: false,
  isInitializing: false,
  errorMessage: null,
}

// Create a storage adapter that matches Zustand's expected interface
const zustandStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return storage.getItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await storage.setItem(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await storage.removeItem(name)
  },
}

export const useInitStore = create<InitState & InitActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setInitialized: (value: boolean) => {
        console.log('InitStore: Setting isInitialized to', value)
        set({ isInitialized: value })
      },

      initialize: async () => {
        console.log('InitStore: Starting initialization...')
        if (get().isInitializing) {
          console.log('InitStore: Already initializing')
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
          set({ errorMessage: message, isInitialized: false })
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
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        errorMessage: state.errorMessage
      }),
      // When store is hydrated from storage, we need to initialize services
      onRehydrateStorage: () => async (state, error) => {
        if (error) {
          console.error('InitStore: Error rehydrating:', error)
          return
        }

        console.log('InitStore: Rehydrated from storage, state:', state)
        
        // Always start in uninitialized state after rehydration
        useInitStore.setState({ isInitialized: false, isInitializing: true })

        try {
          console.log('InitStore: Reinitializing services after rehydration...')
          await serviceManager.initializeServices()
          console.log('InitStore: Services reinitialized successfully')
          useInitStore.setState({ isInitialized: true, isInitializing: false })
        } catch (error) {
          console.error('InitStore: Error reinitializing services:', error)
          useInitStore.setState({ 
            isInitialized: false, 
            isInitializing: false,
            errorMessage: error instanceof Error ? error.message : 'Error reinitializing services'
          })
        }
      }
    }
  )
)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import ServiceManager from '../services/ServiceManager'

interface InitState {
  isInitialized: boolean
  isInitializing: boolean
  error: Error | null
  initialize: () => Promise<void>
  reset: () => void
}

export const useInitStore = create<InitState>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      isInitializing: false,
      error: null,
      
      initialize: async () => {
        if (get().isInitializing || get().isInitialized) return
        
        set({ isInitializing: true })
        
        try {
          await ServiceManager.initializeServices()
          set({ isInitialized: true, error: null })
        } catch (error) {
          set({ error: error as Error })
          throw error
        } finally {
          set({ isInitializing: false })
        }
      },

      reset: () => {
        set({ isInitialized: false, isInitializing: false, error: null })
      }
    }),
    {
      name: 'onyx-init-store',
    }
  )
)
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Route =
  | 'Onboarding1'
  | 'Onboarding2'
  | 'Onboarding3'
  | 'Onboarding4'
  | 'Onboarding5'
  | 'Onboarding6'
  | 'Onboarding7'
  | 'Onboarding8'
  | 'Onboarding9'
  | 'Onboarding10'
  | 'Marketplace'
  | 'Analysis'
  | 'Community'
  | 'Feedback'
  | 'WalletSetup'

interface RouterState {
  currentRoute: Route
}

interface RouterActions {
  navigate: (to: Route) => void
}

export const useRouterStore = create<RouterState & RouterActions>()(
  persist(
    (set) => ({
      currentRoute: 'Onboarding1',
      navigate: (to) => set({ currentRoute: to }),
    }),
    {
      name: 'onyx-router-3',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the currentRoute, not the navigate function
      partialize: (state) => ({
        currentRoute: state.currentRoute
      }),
    }
  )
)

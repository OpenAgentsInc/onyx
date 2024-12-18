import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  navigate: (to: Route) => void
}

export const useRouterStore = create<RouterState>()(
  (set) => ({
    currentRoute: 'Onboarding1',
    navigate: (to) => set({ currentRoute: to }),
  })
)
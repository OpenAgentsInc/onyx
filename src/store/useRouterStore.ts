import { create } from "zustand"
import { persist } from "zustand/middleware"

type Route = 'Onboarding1' | 'Onboarding2' | 'Onboarding3' | 'Marketplace' | 'Analysis' | 'Community' | 'Feedback'

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
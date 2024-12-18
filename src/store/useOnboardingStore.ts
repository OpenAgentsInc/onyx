import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface OnboardingState {
  isOnboarded: boolean
  setOnboarded: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      setOnboarded: () => set({ isOnboarded: true }),
    }),
    {
      name: 'onyx-onboarding-1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

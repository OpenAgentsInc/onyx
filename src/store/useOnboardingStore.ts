import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OnboardingState {
  isOnboarded: boolean;
  setOnboarded: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      setOnboarded: () => set({ isOnboarded: true }),
    }),
    {
      name: 'onyx-onboarding', // storage key
    }
  )
);

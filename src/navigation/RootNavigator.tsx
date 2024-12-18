import React from "react"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { useRouterStore } from "@/store/useRouterStore"

export function RootNavigator() {
  const currentRoute = useRouterStore(state => state.currentRoute)
  const isOnboarded = useOnboardingStore(state => state.isOnboarded)

  return null // TODO: Implement root navigation
}
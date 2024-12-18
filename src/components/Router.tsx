'use dom';

import * as React from "react"
import Onboarding1 from "@/onboarding/Onboarding1"
import Onboarding2 from "@/onboarding/Onboarding2"
import Onboarding3 from "@/onboarding/Onboarding3"
import AnalysisScreen from "@/screens/AnalysisScreen"
import CommunityScreen from "@/screens/CommunityScreen"
import FeedbackScreen from "@/screens/FeedbackScreen"
import MarketplaceScreen from "@/screens/MarketplaceScreen"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { useRouterStore } from "@/store/useRouterStore"

export default function Router() {
  const currentRoute = useRouterStore(state => state.currentRoute)
  // const isOnboarded = useOnboardingStore(state => state.isOnboarded)
  const isOnboarded = false

  const renderContent = () => {
    // If not onboarded, show onboarding flow
    if (!isOnboarded) {
      switch (currentRoute) {
        case 'Onboarding1':
          return <Onboarding1 />
        case 'Onboarding2':
          return <Onboarding2 />
        case 'Onboarding3':
          return <Onboarding3 />
        default:
          return <Onboarding1 />
      }
    }

    // If onboarded, show main screens
    switch (currentRoute) {
      case 'Marketplace':
        return <MarketplaceScreen />
      case 'Analysis':
        return <AnalysisScreen />
      case 'Community':
        return <CommunityScreen />
      case 'Feedback':
        return <FeedbackScreen />
      default:
        return <MarketplaceScreen />
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      width: '100vw',
      height: '100vh'
    }}>
      {renderContent()}
    </div>
  )
}

'use dom';

import * as React from "react"
import Onboarding1 from "@/onboarding/Onboarding1"
import Onboarding10 from "@/onboarding/Onboarding10"
import Onboarding2 from "@/onboarding/Onboarding2"
import Onboarding3 from "@/onboarding/Onboarding3"
import Onboarding4 from "@/onboarding/Onboarding4"
import Onboarding5 from "@/onboarding/Onboarding5"
import Onboarding6 from "@/onboarding/Onboarding6"
import Onboarding7 from "@/onboarding/Onboarding7"
import Onboarding8 from "@/onboarding/Onboarding8"
import Onboarding9 from "@/onboarding/Onboarding9"
import AnalysisScreen from "@/screens/AnalysisScreen"
import CommunityScreen from "@/screens/CommunityScreen"
import FeedbackScreen from "@/screens/FeedbackScreen"
import MarketplaceScreen from "@/screens/MarketplaceScreen"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { useRouterStore } from "@/store/useRouterStore"

export default function Router() {
  const currentRoute = useRouterStore(state => state.currentRoute)
  const isOnboarded = useOnboardingStore(state => state.isOnboarded)
  // const isOnboarded = false

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
        case 'Onboarding4':
          return <Onboarding4 />
        case 'Onboarding5':
          return <Onboarding5 />
        case 'Onboarding6':
          return <Onboarding6 />
        case 'Onboarding7':
          return <Onboarding7 />
        case 'Onboarding8':
          return <Onboarding8 />
        case 'Onboarding9':
          return <Onboarding9 />
        case 'Onboarding10':
          return <Onboarding10 />
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
      backgroundColor: 'transparent',
      width: '100vw',
      height: '100vh'
    }}>
      {renderContent()}
    </div>
  )
}

import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import "@/theme/global.css"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, Text, View, ViewStyle } from "react-native"
import RouterWrapper from "@/navigation/RouterWrapper"
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
import { useInitStore } from "@/store/useInitStore"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { useRouterStore } from "@/store/useRouterStore"
import { customFontsToLoad } from "@/theme/typography"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [loaded] = useFonts(customFontsToLoad)
  const { isInitialized, isInitializing, errorMessage } = useInitStore()
  const { isOnboarded } = useOnboardingStore()
  const { currentRoute } = useRouterStore()
  console.log('currentRoute:', currentRoute)

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => { /* ignore errors */ })
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  if (errorMessage) {
    return (
      <View style={$container}>
        <StatusBar style="light" />
        <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', marginBottom: 20 }}>
          Initialization Error:
        </Text>
        <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular' }}>{errorMessage}</Text>
      </View>
    )
  }

  if (isInitializing || !isInitialized) {
    return (
      <View style={$container}>
        <StatusBar style="light" />
        <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular' }}>
          Initializing Onyx...
        </Text>
      </View>
    )
  }

  console.log('so uh')

  // If we're here, the app is initialized and fonts are loaded.
  // Now decide whether to show onboarding or main app.
  if (!isOnboarded) {
    // Show onboarding flow based on currentRoute
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
        // If somehow we get an unknown route, fallback to Onboarding1
        return <Onboarding1 />
    }
  }

  // If onboarded, show the main router (Marketplace or other screens via RouterWrapper)

  return (
    <View style={$container}>
      <StatusBar style="light" />
      <RouterWrapper />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
}

AppRegistry.registerComponent('main', () => App);

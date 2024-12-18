import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { customFontsToLoad } from "@/theme/typography"
import { DarkTheme, NavigationContainer } from "@react-navigation/native"
import { registerRootComponent } from 'expo'
import { RootNavigator } from "./navigation/RootNavigator"

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

function App() {
  const [loaded] = useFonts(customFontsToLoad)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) return null

  return (
    <NavigationContainer theme={DarkTheme}>
      <RootNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  )
}

export default registerRootComponent(App)
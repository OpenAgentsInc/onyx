if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}

import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import "@/theme/global.css"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, Image, View, ViewStyle } from "react-native"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { Canvas } from "@/canvas"
import { customFontsToLoad } from "@/theme/typography"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { useInitialRootStore, useStores } from "./models"
import { OnyxLayout } from "./onyx/OnyxLayout"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

function App(props: AppProps) {
  useAutoUpdate()
  const { hideSplashScreen } = props

  const [loaded] = useFonts(customFontsToLoad)

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
      console.tron.display({
        name: "Loaded",
      })
    }
  }, [loaded])

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500)
  })

  // Initialize wallet store
  // const { llmStore } = useStores()
  // React.useEffect(() => {
  //   llmStore.initialize()
  // }, [llmStore])

  if (!loaded || !rehydrated) {
    return null
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <View style={$container}>
          <StatusBar style="light" />

          <OnyxLayout />

          <View style={$canvasContainer}>
            <Canvas />
          </View>
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "#000",
}

const $canvasContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
}

const $routerContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  backgroundColor: "transparent",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}

AppRegistry.registerComponent("main", () => App)

export default App

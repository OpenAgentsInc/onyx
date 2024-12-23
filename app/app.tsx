if (__DEV__) {
  require("./devtools/ReactotronConfig.ts")
}

import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import { useFonts } from "expo-font"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { ActivityIndicator, AppRegistry, View, ViewStyle } from "react-native"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { Canvas } from "@/canvas"
import { customFontsToLoad } from "@/theme/typography"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { RootStoreProvider, useInitialRootStore } from "./models"
import { OnyxLayout } from "./onyx/OnyxLayout"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

function AppContents(props: AppProps) {
  useAutoUpdate()
  const { hideSplashScreen } = props
  const [loaded] = useFonts(customFontsToLoad)
  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    setTimeout(hideSplashScreen, 500)
  })

  if (!loaded || !rehydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
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

function App(props: AppProps) {
  return <AppContents {...props} />
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

AppRegistry.registerComponent("main", () => App)

export default App
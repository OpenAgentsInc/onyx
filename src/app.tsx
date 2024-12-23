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
import { log } from "./utils/log"

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

function App(props: AppProps) {
  useAutoUpdate()
  const { hideSplashScreen } = props
  const [loaded] = useFonts(customFontsToLoad)
  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.
    setTimeout(hideSplashScreen, 500)
  })

  // Initialize stores
  const { chatStore, llmStore } = useStores()
  React.useEffect(() => {
    const initStores = async () => {
      try {
        log({
          name: "[App] Initializing stores",
          value: {
            chatStoreInitialized: chatStore.isInitialized,
            llmStoreInitialized: llmStore.isInitialized
          }
        })

        // Initialize chat store
        if (!chatStore.isInitialized) {
          chatStore.setup()
        }

        // Initialize LLM store
        if (!llmStore.isInitialized) {
          await llmStore.initialize()
        }

        log({
          name: "[App] Stores initialized",
          value: {
            chatStoreInitialized: chatStore.isInitialized,
            llmStoreInitialized: llmStore.isInitialized
          }
        })
      } catch (error) {
        log({
          name: "[App] Failed to initialize stores",
          value: error,
          important: true
        })
      }
    }

    initStores()
  }, [chatStore, llmStore])

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

AppRegistry.registerComponent("main", () => App)

export default App
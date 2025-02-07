if (__DEV__) {
  require("./devtools/ReactotronConfig.ts")
}

import "react-native-gesture-handler"
import "@/utils/ignore-warnings"
import "@/utils/polyfills"
import { useFonts } from "expo-font"
import * as React from "react"
import { ActivityIndicator, AppRegistry, View } from "react-native"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { customFontsToLoad } from "@/theme/typography"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { useInitialRootStore } from "./models"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import NotificationService from "./services/notifications"
import Hyperview from "hyperview"
import { Logger, fetchWrapper } from "./hyperview/helpers"
import Behaviors from './hyperview/behaviors'
import Components from './hyperview/components/'
import { AuthProvider, useAuth } from './contexts/AuthContext'

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

function AppContent() {
  const { isAuthenticated } = useAuth()
  const { config } = useInitialRootStore()
  
  // Get the API URL from config
  const apiUrl = config?.API_URL || "http://localhost:8000"
  console.log("API URL:", apiUrl)

  // Set entrypoint based on auth status
  const entrypointUrl = isAuthenticated 
    ? `${apiUrl}/hyperview`
    : `${apiUrl}/auth/login`

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Hyperview
        behaviors={Behaviors}
        components={Components}
        entrypointUrl={entrypointUrl}
        fetch={fetchWrapper}
        formatDate={(date, format) => date?.toLocaleDateString()}
        logger={new Logger(Logger.Level.log)}
      />
    </View>
  )
}

function App(props: AppProps) {
  console.log("App starting...")
  useAutoUpdate()
  const { hideSplashScreen } = props
  const [loaded] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    console.log("Root store initialized")
    setTimeout(hideSplashScreen, 500)
  })

  // Initialize notifications
  React.useEffect(() => {
    console.log("Initializing notifications...")
    NotificationService.init().catch(console.error)
  }, [])

  console.log("Loaded:", loaded)
  console.log("Rehydrated:", rehydrated)

  if (!loaded || !rehydrated && false) {
    console.log("Showing loading screen...")
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <KeyboardProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </KeyboardProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

// Register the app for web
AppRegistry.registerComponent("main", () => App)

// Setup web specific code
if (typeof document !== "undefined") {
  const rootTag = document.getElementById("root") || document.getElementById("main")
  AppRegistry.runApplication("main", { rootTag })
}

export default App
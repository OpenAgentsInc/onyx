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
import * as Linking from 'expo-linking'
import { events } from './services/events'

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

function AppContent() {
  const { isAuthenticated, handleAuthCallback } = useAuth()
  const { config } = useInitialRootStore()
  const [entrypointUrl, setEntrypointUrl] = React.useState<string>('')
  
  // Get the API URL from config
  const apiUrl = config?.API_URL || "http://localhost:8000"
  console.log("[App] API URL:", apiUrl)
  console.log("[App] Initial auth state:", { isAuthenticated })

  // Update entrypoint when auth state changes
  React.useEffect(() => {
    const url = isAuthenticated 
      ? `${apiUrl}/hyperview/main`
      : `${apiUrl}/templates/pages/auth/login.xml`
    console.log('[App] Setting entrypoint:', url)
    setEntrypointUrl(url)
  }, [isAuthenticated, apiUrl])

  // Handle deep links
  React.useEffect(() => {
    console.log("[App] Setting up deep link handlers")
    
    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("[App] Got initial URL:", url)
        handleDeepLink(url)
      }
    })

    // Handle deep links when app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log("[App] Got deep link:", url)
      handleDeepLink(url)
    })

    return () => {
      console.log("[App] Cleaning up deep link listener")
      subscription.remove()
    }
  }, [])

  // Deep link handler
  const handleDeepLink = async (url: string) => {
    console.log('[App] Handling deep link:', url)
    const { path, queryParams } = Linking.parse(url)
    console.log('[App] Parsed deep link:', { path, queryParams })

    // Handle auth success
    if (path === 'auth/success' && queryParams?.token) {
      console.log('[App] Processing auth success with token:', queryParams.token)
      
      try {
        await handleAuthCallback(queryParams.token)
        console.log('[App] Auth callback handled successfully')
      } catch (error) {
        console.error('[App] Error handling auth callback:', error)
      }
    }
  }

  if (!entrypointUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  console.log('[App] Rendering with entrypoint:', entrypointUrl)
  console.log('[App] Current auth state:', { isAuthenticated })

  const handleHyperviewUpdate = (update: any) => {
    console.log("[Hyperview] Update received:", {
      action: update.action,
      behavior: update.behavior,
      behaviorElement: update.behaviorElement,
      options: update.options,
      element: update.element,
      updates: update.updates,
    })
  }

  return (
    <Hyperview
      behaviors={Behaviors}
      components={Components}
      entrypointUrl={entrypointUrl}
      fetch={fetchWrapper}
      formatDate={(date, format) => date?.toLocaleDateString()}
      logger={new Logger(Logger.Level.log)}
      onUpdate={handleHyperviewUpdate}
    />
  )
}

function App(props: AppProps) {
  console.log("[App] Starting...")
  useAutoUpdate()
  const { hideSplashScreen } = props
  const [loaded] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    console.log("[App] Root store initialized")
    setTimeout(hideSplashScreen, 500)
  })

  // Initialize notifications
  React.useEffect(() => {
    console.log("[App] Initializing notifications...")
    NotificationService.init().catch(console.error)
  }, [])

  console.log("[App] Loaded:", loaded)
  console.log("[App] Rehydrated:", rehydrated)

  if (!loaded || !rehydrated && false) {
    console.log("[App] Showing loading screen...")
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
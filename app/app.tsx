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
  const hyperviewRef = React.useRef<any>(null)
  
  // Get the API URL from config
  const apiUrl = config?.API_URL || "http://localhost:8000"
  console.log("API URL:", apiUrl)

  // Listen for auth events
  React.useEffect(() => {
    const unsubscribe = events.on('auth:set-token', async ({ token }) => {
      console.log('Auth token event received:', token)
      try {
        await handleAuthCallback(token)
        console.log('Auth token set successfully')
      } catch (error) {
        console.error('Error handling auth token:', error)
      }
    })
    return () => unsubscribe()
  }, [handleAuthCallback])

  // Handle deep links
  React.useEffect(() => {
    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })

    // Handle deep links when app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // Deep link handler
  const handleDeepLink = async (url: string) => {
    console.log('Handling deep link:', url)
    const { path, queryParams } = Linking.parse(url)

    // Handle auth success
    if (path === 'auth/success' && queryParams?.token) {
      console.log('Auth success, token:', queryParams.token)
      
      // Navigate back to login screen with token parameter
      if (hyperviewRef.current) {
        console.log('Navigating to login with token')
        const loginUrl = `${apiUrl}/templates/pages/auth/login.xml`
        hyperviewRef.current.navigate('replace', loginUrl, {
          'auth': {
            'auth-action': 'set-token',
            'token': queryParams.token,
            'href': `${apiUrl}/hyperview/main`,
          }
        })
      } else {
        console.warn('No hyperview ref available')
      }
    }
  }

  // Set entrypoint based on auth status
  const entrypointUrl = isAuthenticated 
    ? `${apiUrl}/hyperview/main`
    : `${apiUrl}/templates/pages/auth/login.xml`

  console.log('Rendering with entrypoint:', entrypointUrl)
  console.log('Auth state:', { isAuthenticated })

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Hyperview
        ref={hyperviewRef}
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
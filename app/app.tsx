if (__DEV__) {
  require("./devtools/ReactotronConfig.ts")
}

import "react-native-gesture-handler"
import "@/utils/ignore-warnings"
import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import { Buffer } from "buffer"
import { useFonts } from "expo-font"
import * as React from "react"
import { ActivityIndicator, AppRegistry, View, ViewStyle } from "react-native"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { customFontsToLoad } from "@/theme/typography"
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { useInitialRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { useThemeProvider } from "./utils/useAppTheme"

global.Buffer = Buffer

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

function App(props: AppProps) {
  useAutoUpdate()
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)
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
        <KeyboardProvider>
          <AppNavigator
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </KeyboardProvider>
        {/* <View style={$container}>
          <View style={$canvasContainer}>
            <Canvas />
          </View>
          <ChatDrawerContainer />
        </View> */}
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

// function App(props: AppProps) {
//   const { themeScheme, setThemeContextOverride, navigationTheme, ThemeProvider } =
//     useThemeProvider("dark")
//   const navigationRef = createNavigationContainerRef<any>()
//   return (
//     <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
//       <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
//         <AppContents {...props} />
//       </NavigationContainer>
//     </ThemeProvider>
//   )
// }

// const $container: ViewStyle = {
//   flex: 1,
//   backgroundColor: "#000",
// }

// const $canvasContainer: ViewStyle = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   zIndex: 0,
// }

AppRegistry.registerComponent("main", () => App)

export default App

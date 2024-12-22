import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import "@/theme/global.css"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, Image, View, ViewStyle } from "react-native"
import { Canvas } from "@/canvas"
import { customFontsToLoad } from "@/theme/typography"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { OnyxLayout } from "./onyx/OnyxLayout"
import ChatContainer from "./screens/Chat/ChatContainer"

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

  if (!loaded) {
    return null
  }

  return (
    <View style={$container}>
      <StatusBar style="light" />
      {/* <View
        style={{
          position: "absolute",
          backgroundColor: "#1B1B1B",
          left: 30,
          right: 30,
          height: 40,
          bottom: 40,
          zIndex: 8,
          borderRadius: 10,
        }}
      /> */}
      <OnyxLayout />

      <View style={$canvasContainer}>
        <Canvas />
      </View>
    </View>
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

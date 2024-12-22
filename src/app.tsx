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

function App() {
  useAutoUpdate()

  const [loaded] = useFonts(customFontsToLoad)

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

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

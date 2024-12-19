import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import "@/theme/global.css"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, View, ViewStyle } from "react-native"
import { Canvas } from "@/canvas"
import { customFontsToLoad } from "@/theme/typography"
import ChatContainer from "./screens/Chat/ChatContainer"

function App() {

  const [loaded] = useFonts(customFontsToLoad);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={$container}>
      <StatusBar style="light" />
      <View style={$routerContainer}>
        {/* <Text style={{ fontFamily: typography.primary.medium, color: 'white' }}>Onyx</Text> */}
        {/* <RouterWrapper /> */}
        <ChatContainer />
      </View>
      <View style={$canvasContainer}>
        <Canvas />
      </View>

    </View>
  );
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
}

const $canvasContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
}

const $routerContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  backgroundColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
}

AppRegistry.registerComponent('main', () => App);

export default App;

import "@/utils/crypto-polyfill"
import "text-encoding-polyfill"
import "@/theme/global.css" // Import global styles
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, View, ViewStyle } from "react-native"
import { Canvas } from "@/canvas"
import RouterWrapper from "@/navigation/RouterWrapper"

function App() {
  return (
    <View style={$container}>
      <StatusBar style="light" />
      <View style={$canvasContainer}>
        <Canvas />
      </View>
      {/* <View style={$routerContainer}>
        <RouterWrapper />
      </View> */}
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
}

AppRegistry.registerComponent('main', () => App);

export default App;

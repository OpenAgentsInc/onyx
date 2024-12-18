import "./utils/crypto-polyfill"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, View, ViewStyle } from "react-native"
import { Canvas } from "@/canvas"
import Router from "@/navigation/Router"
import InitializationGuard from "./components/InitializationGuard"
import { clearAllStorage } from "./utils/clearStorage"

function App() {
  React.useEffect(() => {
    // Clear storage on app start (temporary fix)
    clearAllStorage()
  }, [])

  return (
    <View style={$container}>
      <StatusBar style="light" />
      <View style={$canvasContainer}>
        <Canvas />
      </View>
      <View style={$routerContainer}>
        <InitializationGuard>
          <Router />
        </InitializationGuard>
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
  zIndex: 1,
}

const $routerContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2,
  backgroundColor: 'transparent',
}

AppRegistry.registerComponent('main', () => App);

export default App;

import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, View, ViewStyle } from "react-native"
import Router from "@/components/Router"
import { Canvas } from "@/components/Canvas"

function App() {
  return (
    <View style={$container}>
      <StatusBar style="light" />
      <View style={$canvasContainer}>
        <Canvas />
      </View>
      <View style={$routerContainer}>
        <Router />
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
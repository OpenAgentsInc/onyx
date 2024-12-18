import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, View } from "react-native"
import Router from "@/components/Router"

function App() {
  return (
    <>
      <StatusBar style="light" />
      <Router />
      <View style={{ flex: 1, backgroundColor: 'black' }} />
    </>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;

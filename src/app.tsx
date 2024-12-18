import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry, View } from "react-native"
import Router from "@/components/Router"

function App() {
  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: 'black', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <Router />
    </>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;

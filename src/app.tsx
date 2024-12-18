import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { AppRegistry } from "react-native"
import Router from "@/components/Router"

function App() {
  return (
    <>
      <StatusBar style="light" />
      <Router />
    </>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;

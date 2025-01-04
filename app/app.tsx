import { AppRegistry, Text, View } from "react-native"

function App() {
  return (
    <View
      style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ color: "white" }}>App</Text>
    </View>
  )
}

AppRegistry.registerComponent("main", () => App)

export default App

import { AppRegistry, Text, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

function App() {
  return (
    <SafeAreaProvider>
      <View
        style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "white" }}>App</Text>
      </View>
    </SafeAreaProvider>
  )
}

// Register the app for web
AppRegistry.registerComponent("main", () => App)

// Setup web specific code
if (typeof document !== "undefined") {
  const rootTag = document.getElementById("root") || document.getElementById("main")
  AppRegistry.runApplication("main", { rootTag })
}

export default App
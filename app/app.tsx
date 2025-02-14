import { registerRootComponent } from "expo"
import { Text, View } from "react-native"
import { useAutoUpdate } from "./hooks/useAutoUpdate"

export default function App() {
  useAutoUpdate()
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Hello</Text>
    </View>
  )
}

registerRootComponent(App);

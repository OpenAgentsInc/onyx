import { registerRootComponent } from "expo"
import { StyleSheet, Text, View } from "react-native"
import { useAutoUpdate } from "./hooks/useAutoUpdate"

export default function App() {
  useAutoUpdate()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
})

registerRootComponent(App);

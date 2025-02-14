import { registerRootComponent } from "expo"
import * as React from "react"
import { StyleSheet, Text, View } from "react-native"
import Config from "./config"
import { useAutoUpdate } from "./hooks/useAutoUpdate"
import { wsManager } from "./lib/ws/manager"

export default function App() {
  useAutoUpdate()
  const [lastMessage, setLastMessage] = React.useState<string>('')

  React.useEffect(() => {
    // Initialize WebSocket connection
    if (Config.WS_URL) {
      wsManager.initialize(Config.WS_URL)

      // Set up message handler
      const unsubscribe = wsManager.onMessage((data) => {
        console.log('Received message:', data)
        setLastMessage(data)
      })

      // Cleanup on unmount
      return () => {
        unsubscribe()
        wsManager.cleanup()
      }
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>WebSocket App</Text>
      {lastMessage ? (
        <Text style={styles.message}>Last message: {lastMessage}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})

registerRootComponent(App);

import React from "react"
import { View, ViewStyle } from "react-native"
import { useInitStore } from "../store/useInitStore"
import Router from "./Router"

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: 'transparent',
  paddingTop: 60, // Add space for status bar
}

export default function RouterWrapper() {
  const { isInitialized, isInitializing, errorMessage } = useInitStore()
  const initialize = useInitStore(state => state.initialize)

  React.useEffect(() => {
    // Only initialize in native context
    initialize().catch(console.error)
  }, [])

  return (
    <View style={$container}>
      <Router
        isInitialized={isInitialized}
        isInitializing={isInitializing}
        errorMessage={errorMessage}
        onRetry={initialize}
      />
    </View>
  )
}

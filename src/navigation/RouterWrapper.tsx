import React from 'react'
import { View } from 'react-native'
import Router from './Router'
import { useInitStore } from '../store/useInitStore'

export default function RouterWrapper() {
  const { isInitialized, isInitializing, errorMessage } = useInitStore()
  const initialize = useInitStore(state => state.initialize)

  React.useEffect(() => {
    // Only initialize in native context
    initialize().catch(console.error)
  }, [])

  // Pass initialization state to Router
  return (
    <View style={{ flex: 1 }}>
      <Router 
        isInitialized={isInitialized}
        isInitializing={isInitializing}
        errorMessage={errorMessage}
        onRetry={initialize}
      />
    </View>
  )
}
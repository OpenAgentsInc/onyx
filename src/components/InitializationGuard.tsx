import * as React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { useInitStore } from '../store/useInitStore'

interface InitializationGuardProps {
  children: React.ReactNode
}

export default function InitializationGuard({ children }: InitializationGuardProps) {
  const { isInitialized, isInitializing, errorMessage } = useInitStore()
  const initialize = useInitStore(state => state.initialize)

  React.useEffect(() => {
    initialize().catch(console.error)
  }, [])

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Initialization Error</Text>
          <Text style={styles.text}>{errorMessage}</Text>
          <Text 
            style={styles.button}
            onPress={() => initialize()}
          >
            Retry
          </Text>
        </View>
      </View>
    )
  }

  if (isInitializing || !isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Initializing Onyx...</Text>
      </View>
    )
  }

  return children
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'jetBrainsMonoRegular',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'jetBrainsMonoRegular',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'jetBrainsMonoRegular',
  }
})
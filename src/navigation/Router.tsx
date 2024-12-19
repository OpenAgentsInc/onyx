import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Marketplace from '../screens/Marketplace'

const Stack = createNativeStackNavigator()

// Customize dark theme to ensure black backgrounds
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000',
    card: '#000',
    border: '#333',
  },
}

interface RouterProps {
  isInitialized: boolean
  isInitializing: boolean
  errorMessage: string | null
  onRetry: () => void
}

export default function Router({ 
  isInitialized,
  isInitializing,
  errorMessage,
  onRetry
}: RouterProps) {
  if (errorMessage) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Initialization Error</Text>
          <Text style={styles.text}>{errorMessage}</Text>
          <Text 
            style={styles.button}
            onPress={onRetry}
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

  return (
    <View style={styles.container}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: '#000',
          }
        }}>
          <Stack.Screen 
            name="Marketplace" 
            component={Marketplace}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
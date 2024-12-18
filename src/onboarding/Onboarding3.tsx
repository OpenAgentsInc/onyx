import { useNavigation } from '@react-navigation/native'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useOnboardingStore } from '../store/useOnboardingStore'

export default function Onboarding3() {
  const navigation = useNavigation()
  const completeOnboarding = useOnboardingStore(state => state.completeOnboarding)

  const handleComplete = () => {
    completeOnboarding()
    navigation.navigate('Marketplace' as never)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to Start</Text>
      <Text style={styles.description}>
        You're all set to explore Onyx's powerful features
      </Text>
      <Pressable 
        onPress={handleComplete}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})
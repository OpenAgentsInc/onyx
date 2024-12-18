import { useNavigation } from '@react-navigation/native'
import { View, Text, Pressable, StyleSheet } from 'react-native'

export default function Onboarding2() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Data Analysis</Text>
      <Text style={styles.description}>
        Analyze your data with powerful tools while maintaining privacy
      </Text>
      <Pressable 
        onPress={() => navigation.navigate('Onboarding3' as never)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
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
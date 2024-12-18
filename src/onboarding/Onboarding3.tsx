import { useRouter } from "expo-router"
import React from "react"
import { Button, Text, View } from "react-native"
import { useOnboardingStore } from "../../store/useOnboardingStore"

export default function Onboarding3Screen() {
  const router = useRouter()
  const setOnboarded = useOnboardingStore(state => state.setOnboarded)

  const finishOnboarding = () => {
    console.log('Finishing onboarding...')
    setOnboarded()
    // After setting onboarded, redirect to main app content
    router.replace('/(tabs)/marketplace')
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16, marginBottom: 20 }}>
        You're all set! Let's get started.
      </Text>
      <Button
        title="Done"
        onPress={finishOnboarding}
      />
    </View>
  )
}

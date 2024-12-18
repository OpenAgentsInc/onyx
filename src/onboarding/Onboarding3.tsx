import React from "react"
import { Pressable, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useOnboardingStore } from "@/store/useOnboardingStore"

export default function Onboarding3Screen() {
  const navigation = useNavigation()
  const setOnboarded = useOnboardingStore(state => state.setOnboarded)

  const finishOnboarding = () => {
    setOnboarded()
    // The onboarding state change will trigger the root navigator to show Main
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16, marginBottom: 20 }}>
        You're all set! Let's get started.
      </Text>
      <Pressable onPress={finishOnboarding}>
        <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16 }}>
          Done
        </Text>
      </Pressable>
    </View>
  )
}
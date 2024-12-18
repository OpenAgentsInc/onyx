import { useRouter } from "expo-router"
import React from "react"
import { Button, Text, View } from "react-native"

export default function Onboarding2Screen() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16, marginBottom: 20 }}>
        Here's how to use Onyx's voice commands...
      </Text>
      <Button
        title="Next"
        onPress={() => router.push('/onboarding/Onboarding3Screen')}
      />
    </View>
  )
}

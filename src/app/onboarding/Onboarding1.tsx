import { useRouter } from "expo-router"
import React from "react"
import { Button, Text, View } from "react-native"

export default function Onboarding1Screen() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16, marginBottom: 20 }}>
        Welcome to Onyx! Let's get started with a brief intro.
      </Text>
      <Button
        title="Next"
        onPress={() => router.push('/onboarding/Onboarding2')}
      />
    </View>
  )
}
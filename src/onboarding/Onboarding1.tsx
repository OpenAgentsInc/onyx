import { Link } from "expo-router"
import React from "react"
import { Pressable, Text, View } from "react-native"

export default function Onboarding1Screen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16, marginBottom: 20 }}>
        Welcome to Onyx! Let's get started with a brief intro.
      </Text>
      <Link href="/onboarding/Onboarding2" asChild>
        <Pressable>
          <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16 }}>
            Next
          </Text>
        </Pressable>
      </Link>
    </View>
  )
}
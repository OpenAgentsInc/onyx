import { Link } from "expo-router"
import * as React from "react"
import { Text, View } from 'react-native'

export default function OnboardingIndexScreen() {
  return (
    <View style={{
      backgroundColor: '#000',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Link href="/onboarding/Onboarding1" asChild>
        <Text style={{ color: 'white' }}>Start Onboarding</Text>
      </Link>
    </View>
  );
}
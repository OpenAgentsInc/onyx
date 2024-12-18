import React from "react"
import { Pressable, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function Onboarding2Screen() {
  const navigation = useNavigation()

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16, marginBottom: 20 }}>
        Here's how to use Onyx's voice commands...
      </Text>
      <Pressable onPress={() => navigation.navigate('Onboarding3')}>
        <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16 }}>
          Next
        </Text>
      </Pressable>
    </View>
  )
}
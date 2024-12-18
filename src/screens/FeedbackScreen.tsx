import React from "react"
import { Text, View } from "react-native"

export default function FeedbackScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16 }}>
        Feedback Screen
      </Text>
    </View>
  )
}
import React from "react"
import { Text, View } from "react-native"

export default function AnalysisScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: 'jetBrainsMonoRegular', fontSize: 16 }}>
        Analysis Screen
      </Text>
    </View>
  )
}
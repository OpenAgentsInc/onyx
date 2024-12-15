import React from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { colorsDark } from "@/theme"

export function OnyxStatus() {
  return (
    <View style={$container}>
      <Text preset="default" style={$text}>
        Model not loaded
      </Text>
    </View>
  )
}

const $container: ViewStyle = {
  backgroundColor: "black",
  borderBottomColor: colorsDark.border,
  borderBottomWidth: 1,
  paddingVertical: 8,
  alignItems: "center",
  justifyContent: "center",
}

const $text = {
  color: "white",
}

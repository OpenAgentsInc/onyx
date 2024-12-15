import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle } from "react-native"
import { Canvas } from "@/components/Canvas"
import { OnyxStatus } from "@/components/OnyxStatus"

export const OnyxScreen = observer(function OnyxScreen() {
  return (
    <View style={[$container]}>
      <OnyxStatus />
      <Canvas />
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
  paddingTop: 0,
}

export default OnyxScreen

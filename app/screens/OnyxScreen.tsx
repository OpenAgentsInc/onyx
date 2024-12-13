import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { Canvas } from "@/components/Canvas"
import PylonOverlay from "@/components/PylonOverlay"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface OnyxScreenProps {
  visible?: boolean
}

export const OnyxScreen = observer(function OnyxScreen({ visible = true }: OnyxScreenProps) {
  const $topInset = useSafeAreaInsetsStyle(["top"])

  if (!visible) return null

  return (
    <View style={[$container, $topInset]}>
      <Canvas />
      <PylonOverlay />
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
  padding: 16,
}

export default OnyxScreen
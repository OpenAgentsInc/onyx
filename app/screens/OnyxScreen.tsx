import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle } from "react-native"
import { Canvas } from "@/components/Canvas"
import { OnyxStatus } from "@/components/OnyxStatus"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface OnyxScreenProps {
  visible?: boolean
}

export const OnyxScreen = observer(function OnyxScreen({ visible = true }: OnyxScreenProps) {
  const $topInset = useSafeAreaInsetsStyle(["top"])

  if (!visible) return null

  return (
    <View style={[$container, $topInset]}>
      <OnyxStatus />
      <Canvas />
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
  padding: 16,
  paddingTop: 0, // Removed paddingTop since OnyxStatus will handle the spacing
}

export default OnyxScreen
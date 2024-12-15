import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle } from "react-native"
import { Canvas } from "@/components/Canvas"
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
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
  padding: 16,
}

const $fileExplorer: ViewStyle = {
  position: 'absolute',
  top: 60,
  left: 8,
  right: 8,
  bottom: 8,
  backgroundColor: '#1a1a1a',
  borderRadius: 8,
  overflow: 'hidden',
}

export default OnyxScreen

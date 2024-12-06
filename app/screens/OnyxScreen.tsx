import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components"
import NexusOverlay from "@/components/NexusOverlay"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface OnyxScreenProps {
  visible?: boolean
}

export const OnyxScreen = observer(function OnyxScreen({ visible = true }: OnyxScreenProps) {
  const $topInset = useSafeAreaInsetsStyle(["top"])

  if (!visible) return null

  return (
    <View style={[$container, $topInset]}>
      <NexusOverlay />
      <Text>Onyx Screen</Text>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#fff',
  padding: 16,
}

export default OnyxScreen
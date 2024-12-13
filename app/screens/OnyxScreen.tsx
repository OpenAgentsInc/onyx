import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components"
import { Canvas } from "@/components/Canvas"
import { PylonOverlay } from "@/components/PylonOverlay"
import { FileExplorer } from "@/components/FileExplorer"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { typography } from "@/theme"

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
      <Text style={$connectionText}>Connected to Pylon</Text>
      <View style={$fileExplorer}>
        <FileExplorer />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
  padding: 16,
}

const $connectionText: TextStyle = {
  color: '#fff',
  fontSize: 14,
  marginTop: 16,
  marginBottom: 8,
  fontFamily: typography.primary.light,
}

const $fileExplorer: ViewStyle = {
  flex: 1,
  backgroundColor: '#1a1a1a',
  borderRadius: 8,
  overflow: 'hidden',
}

export default OnyxScreen
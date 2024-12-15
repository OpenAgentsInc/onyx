import { observer } from "mobx-react-lite"
import React from "react"
import { View, ViewStyle } from "react-native"
import { Canvas } from "@/components/Canvas"
import { OnyxStatus } from "@/components/OnyxStatus"
import { LlamaRNExample } from "./LlamaRNExample"

export const OnyxScreen = observer(function OnyxScreen() {
  return (
    <View style={$container}>
      <View style={$canvasContainer}>
        <Canvas />
      </View>
      <View style={$chatContainer}>
        <LlamaRNExample />
      </View>
      <View style={$statusContainer}>
        <OnyxStatus />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#000',
}

const $statusContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 4, // Increased to be above chat
}

const $canvasContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
}

const $chatContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 3,
  backgroundColor: 'transparent',
  paddingTop: 40, // Add padding to avoid overlap with status bar
}

export default OnyxScreen
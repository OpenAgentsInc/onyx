import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { useWebSocket } from "@/services/websocket/useWebSocket"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { WS_CONFIG } from "@/config/websocket"

interface NexusOverlayProps {
  visible?: boolean
}

export const NexusOverlay: FC<NexusOverlayProps> = observer(function NexusOverlay({ visible = true }) {
  const { state } = useWebSocket(WS_CONFIG)
  const $topInset = useSafeAreaInsetsStyle(["top"])

  if (!visible) return null

  const statusText = state.connecting ? "Connecting..." : 
                    state.error ? "Connection Error" :
                    state.connected ? "Connected to Nexus" : 
                    "Disconnected"

  const statusColor = state.connected ? "#4CAF50" : // Green
                     state.connecting ? "#FFC107" : // Yellow
                     "#F44336" // Red

  return (
    <View style={[$overlay, $topInset]}>
      <View style={$statusContainer}>
        <View style={[$statusDot, { backgroundColor: statusColor }]} />
        <Text style={$statusText}>{statusText}</Text>
        {state.error && (
          <Text style={$errorText}>{state.error}</Text>
        )}
      </View>
    </View>
  )
})

const $overlay: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  padding: 16,
  zIndex: 1000,
}

const $statusContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.7)",
  padding: 8,
  borderRadius: 8,
  alignSelf: "flex-start",
}

const $statusDot: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginRight: 8,
}

const $statusText = {
  color: "#fff",
  fontSize: 14,
}

const $errorText = {
  color: "#F44336",
  fontSize: 12,
  marginTop: 4,
}
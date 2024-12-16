import { FC } from "react"
import { View, Text, ViewStyle, TextStyle, ActivityIndicator } from "react-native"
import { colors } from "@/theme"

interface StatusIndicatorProps {
  isModelLoading?: boolean
  isTranscribing?: boolean
  isInferencing?: boolean
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({
  isModelLoading,
  isTranscribing,
  isInferencing,
}) => {
  if (!isModelLoading && !isTranscribing && !isInferencing) return null

  let message = ""
  if (isModelLoading) message = "Loading model..."
  else if (isTranscribing) message = "Transcribing..."
  else if (isInferencing) message = "Processing..."

  return (
    <View style={$container}>
      <ActivityIndicator color={colors.tint} size="small" style={$spinner} />
      <Text style={$text}>{message}</Text>
    </View>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  bottom: 130,
  left: 0,
  right: 0,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  backgroundColor: "rgba(0,0,0,0.5)",
  paddingVertical: 8,
}

const $spinner: ViewStyle = {
  marginRight: 8,
}

const $text: TextStyle = {
  color: "#fff",
  fontSize: 14,
}
import { FC } from "react"
import { View, ViewStyle, Dimensions } from "react-native"
import { Text } from "@/components"
import { Message } from "@/models/ChatStore"
import { TypewriterText } from "./TypewriterText"

interface SingleMessageDisplayProps {
  message: Message
}

export const SingleMessageDisplay: FC<SingleMessageDisplayProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant'
  const windowHeight = Dimensions.get('window').height
  const topPosition = Math.max(windowHeight * 0.3, 100) // At least 100px from top, or 30% of screen height

  return (
    <View style={[$container, { top: topPosition }]}>
      {isAssistant ? (
        <TypewriterText text={message.content} style={$messageText} />
      ) : (
        <Text style={$messageText}>{message.content}</Text>
      )}
    </View>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  left: 20,
  right: 20,
  maxHeight: "60%", // Maximum height constraint
  backgroundColor: "rgba(0,0,0,0.3)",
  padding: 20,
  borderRadius: 8,
}

const $messageText = {
  color: "#fff",
  textAlign: "center" as const,
  fontSize: 18,
}
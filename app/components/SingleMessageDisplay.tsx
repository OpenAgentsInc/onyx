import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { Message } from "@/models/ChatStore"
import { TypewriterText } from "./TypewriterText"

interface SingleMessageDisplayProps {
  message: Message
}

export const SingleMessageDisplay: FC<SingleMessageDisplayProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant'

  return (
    <View style={$container}>
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
  top: "48%", // Moved down from 45% to 48%
  left: 20,
  right: 20,
  transform: [{ translateY: -50 }],
  backgroundColor: "rgba(0,0,0,0.3)",
  padding: 20,
  borderRadius: 8,
  alignItems: "center",
}

const $messageText = {
  color: "#fff",
  textAlign: "center" as const,
  fontSize: 18,
}
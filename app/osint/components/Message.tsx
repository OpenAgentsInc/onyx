import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { Message as MessageType } from "../types"

interface MessageProps {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  return (
    <View style={{ marginVertical: 15 }}>
      <Text className="opacity-50">{message.user}</Text>
      <Text>{message.text}</Text>
    </View>
  )
}
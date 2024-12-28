import { View } from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatOverlay } from "@/onyx/ChatOverlay"
import { ChatBar } from "./ChatBar"

export const Chat = () => {
  const { isLoading, messages } = useChat()
  return (
    <View style={{ flex: 1 }}>
      <ChatOverlay messages={messages} isLoading={isLoading} />
      <ChatBar />
    </View>
  )
}

import { View } from "react-native"
import { Header, KeyboardDismisser } from "@/components"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

export const Chat = () => {
  const { handleSendMessage, isLoading, messages } = useChat()

  return (
    <View style={{ flex: 1 }}>
      <KeyboardDismisser />
      <View style={{ flex: 1 }}>
        <Header title="Chat" />
        <ChatOverlay messages={messages} isLoading={isLoading} />
        <ChatBar handleSendMessage={handleSendMessage} />
      </View>
    </View>
  )
}

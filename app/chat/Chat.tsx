import { View } from "react-native"
import { Header, KeyboardDismisser } from "@/components"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"
import { useState } from "react"

export const Chat = () => {
  const { handleSendMessage, isLoading, messages } = useChat()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <View style={{ flex: 1 }}>
      <KeyboardDismisser />
      <View style={{ flex: 1 }}>
        <Header 
          title="Chat" 
          leftIcon="menu"
          onLeftPress={() => setDrawerOpen(prev => !prev)}
        />
        <ChatOverlay messages={messages} isLoading={isLoading} />
        <ChatBar handleSendMessage={handleSendMessage} />
      </View>
    </View>
  )
}
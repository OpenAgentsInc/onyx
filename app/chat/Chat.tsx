import { View } from "react-native"
import { Header, KeyboardDismisser } from "@/components"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

interface ChatProps {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

export const Chat = ({ drawerOpen, setDrawerOpen }: ChatProps) => {
  const { handleSendMessage, isLoading, messages } = useChat()

  return (
    <View style={{ flex: 1 }}>
      <KeyboardDismisser />
      <View style={{ flex: 1 }}>
        <Header 
          title="Chat" 
          leftIcon="menu"
          onLeftPress={() => setDrawerOpen(!drawerOpen)}
        />
        <ChatOverlay messages={messages} isLoading={isLoading} />
        <ChatBar handleSendMessage={handleSendMessage} />
      </View>
    </View>
  )
}
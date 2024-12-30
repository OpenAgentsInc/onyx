import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Header, KeyboardDismisser } from "@/components"
import { useChat } from "@/hooks/useChat"
import { navigate } from "@/navigators"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

interface ChatProps {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

export const Chat = observer(({ drawerOpen, setDrawerOpen }: ChatProps) => {
  const { handleSendMessage, isLoading, messages } = useChat()

  return (
    <View style={{ flex: 1 }}>
      <KeyboardDismisser />
      <View style={{ flex: 1 }}>
        <Header
          title="Onyx Chat"
          leftIcon="menu"
          onLeftPress={() => setDrawerOpen(!drawerOpen)}
          rightIcon="settings"
          onRightPress={() => navigate("Settings")}
        />
        <ChatOverlay messages={messages} isLoading={isLoading} />
        <ChatBar handleSendMessage={handleSendMessage} />
      </View>
    </View>
  )
})
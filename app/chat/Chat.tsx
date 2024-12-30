import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Header, KeyboardDismisser } from "@/components"
import { useChat } from "@/hooks/useChat"
import { navigate } from "@/navigators"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
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
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          enableAutomaticScroll={true}
          extraScrollHeight={100}
        >
          <View style={{ flex: 1 }}>
            <ChatOverlay messages={messages} isLoading={isLoading} />
            <ChatBar handleSendMessage={handleSendMessage} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
})
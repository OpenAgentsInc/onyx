import { observer } from "mobx-react-lite"
import { Platform, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { Header } from "@/components"
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
          enabled={true}
          disableScrollOnKeyboardHide={false}
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

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
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            enabled={true}
            disableScrollOnKeyboardHide={false}
          >
            <ChatOverlay messages={messages} isLoading={isLoading} />
          </KeyboardAwareScrollView>
          <View style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            backgroundColor: 'transparent'
          }}>
            <ChatBar handleSendMessage={handleSendMessage} />
          </View>
        </View>
      </View>
    </View>
  )
})
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
          <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ flex: 1, marginBottom: 70 }}>
              <ChatOverlay messages={messages} isLoading={isLoading} />
            </View>
            <View style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}>
              <ChatBar handleSendMessage={handleSendMessage} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
})
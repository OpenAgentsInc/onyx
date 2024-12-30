import { View, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { Header } from "@/components"
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
          extraKeyboardSpace={Platform.select({
            ios: 20,
            android: 10
          })}
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
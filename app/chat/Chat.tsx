import { observer } from "mobx-react-lite"
import { Platform, View } from "react-native"
import { KeyboardAwareScrollView, useReanimatedKeyboardAnimation } from "react-native-keyboard-controller"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
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
  const { height } = useReanimatedKeyboardAnimation()

  const chatBarContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: height.value }],
  }))

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: '#000000',
    // Only add bottom padding when keyboard is not showing (height.value === 0)
    paddingBottom: height.value === 0 ? 20 : 0,
  }))

  return (
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
        <Animated.View style={chatBarContainerStyle}>
          <Animated.View style={backgroundStyle}>
            <ChatBar handleSendMessage={handleSendMessage} />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  )
})
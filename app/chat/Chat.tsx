import { Keyboard, Pressable, View } from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"
import { useKeyboard } from "@/hooks/useKeyboard"

export const Chat = () => {
  const { handleSendMessage, isLoading, messages } = useChat()
  const { isOpened } = useKeyboard()

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: isOpened ? 2 : -1,
        }}
        onPress={Keyboard.dismiss}
      />
      <View style={{ flex: 1 }}>
        <ChatOverlay messages={messages} isLoading={isLoading} />
        <ChatBar handleSendMessage={handleSendMessage} />
      </View>
    </View>
  )
}
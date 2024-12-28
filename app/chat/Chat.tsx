import { Keyboard, TouchableWithoutFeedback, View } from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

export const Chat = () => {
  const { isLoading, messages } = useChat()
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, zIndex: 1 }}>
          <ChatOverlay messages={messages} isLoading={isLoading} />
        </View>
      </TouchableWithoutFeedback>
      <View style={{ zIndex: 2 }}>
        <ChatBar />
      </View>
    </View>
  )
}
import { Keyboard, Pressable, View } from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

export const Chat = () => {
  const { isLoading, messages } = useChat()
  return (
    <Pressable 
      style={{ flex: 1, flexDirection: "column" }}
      onPress={() => {
        console.log("Chat container pressed")
        Keyboard.dismiss()
      }}
    >
      <View style={{ flex: 1 }}>
        <ChatOverlay messages={messages} isLoading={isLoading} />
      </View>
      <ChatBar />
    </Pressable>
  )
}
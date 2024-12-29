import { Keyboard, Pressable, View } from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

export const Chat = () => {
  const { isLoading, messages } = useChat()
  return (
    <View style={{ flex: 1 }}>
      <Pressable 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}
        onPress={() => {
          console.log("Chat container pressed")
          Keyboard.dismiss()
        }}
      />
      <View style={{ flex: 1, flexDirection: "column", zIndex: 2 }}>
        <View style={{ flex: 1 }}>
          <ChatOverlay messages={messages} isLoading={isLoading} />
        </View>
        <ChatBar />
      </View>
    </View>
  )
}
import { View } from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"
import { DismissKeyboardView } from "@/components/DismissKeyboardView"

export const Chat = () => {
  const { isLoading, messages } = useChat()
  return (
    <DismissKeyboardView style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 1 }}>
        <ChatOverlay messages={messages} isLoading={isLoading} />
      </View>
      <ChatBar />
    </DismissKeyboardView>
  )
}
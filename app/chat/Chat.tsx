import { View } from "react-native"
import { ChatOverlay } from "@/onyx/ChatOverlay"
import { ChatBar } from "./ChatBar"

const dummyMessages = [
  {
    id: "1",
    content: "Hello, world!",
    role: "user" as const,
  },
  {
    id: "2",
    content: "How are you?",
    role: "assistant" as const,
  },
  {
    id: "3",
    content: "I'm doing well, thank you!",
    role: "user" as const,
  },
]

export const Chat = () => {
  return (
    <View style={{ flex: 1 }}>
      <ChatOverlay messages={dummyMessages} isLoading={false} />
      <ChatBar />
    </View>
  )
}

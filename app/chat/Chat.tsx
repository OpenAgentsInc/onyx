import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { useChat } from "@/hooks/useChat"
import { ChatBar } from "./ChatBar"
import { ChatOverlay } from "./ChatOverlay"

export const Chat = () => {
  console.log("GRR")
  const { isLoading, messages } = useChat()
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
    >
      <Pressable
        onPress={Keyboard.dismiss}
        accessible={false}
        style={{
          zIndex: 9999,
          flex: 1,
          // backgroundColor: "blue",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
        }}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ flex: 1 }}>
            <ChatOverlay messages={messages} isLoading={isLoading} />
          </View>
          <ChatBar />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  )
}

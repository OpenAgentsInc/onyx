import { observer } from "mobx-react-lite"
import { FC, useState } from "react"
import { ScrollView, TextInput, View, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useWebSocket } from "@/services/websocket/useWebSocket"

interface ChatScreenProps extends AppStackScreenProps<"Chat"> { }

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen() {
  const [input, setInput] = useState("")
  const { state, messages, sendMessage } = useWebSocket({
    url: "ws://localhost:8000",
    apiKey: process.env.NEXUS_API_KEY,
  })

  const handleSubmit = () => {
    if (!input.trim() || !state.connected) return
    
    try {
      sendMessage(input)
      setInput("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <View style={$container}>
        <View style={$statusBar}>
          <Text>
            Status: {state.connected ? "Connected" : state.connecting ? "Connecting..." : "Disconnected"}
            {state.error ? ` (${state.error})` : ""}
          </Text>
        </View>

        <ScrollView style={$messagesContainer}>
          {messages.map((message, index) => (
            <View key={message.id || index} style={$messageWrapper}>
              <View style={$message}>
                <Text style={$messageText}>{message.payload.answer}</Text>
                {message.payload.usage && (
                  <Text style={$usageText}>
                    Tokens: {message.payload.usage.total_tokens}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={$inputContainer}>
          <TextInput
            style={$input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            onSubmitEditing={handleSubmit}
            editable={state.connected}
          />
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $statusBar: ViewStyle = {
  padding: 8,
  backgroundColor: "#f5f5f5",
  borderRadius: 4,
  marginBottom: 16,
}

const $messagesContainer: ViewStyle = {
  flex: 1,
  marginBottom: 16,
}

const $messageWrapper: ViewStyle = {
  marginVertical: 8,
}

const $message: ViewStyle = {
  backgroundColor: "#f0f0f0",
  padding: 12,
  borderRadius: 8,
  maxWidth: "80%",
}

const $messageText = {
  fontSize: 16,
}

const $usageText = {
  fontSize: 12,
  color: "#666",
  marginTop: 4,
}

const $inputContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $input = {
  flex: 1,
  height: 40,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 20,
  paddingHorizontal: 16,
  backgroundColor: "white",
}

export default ChatScreen
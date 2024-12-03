import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { Text } from "@/components"
import { useChat } from "@ai-sdk/react"
import { useStores } from "@/models"

interface ChatOverlayProps {
  visible?: boolean
}

export const ChatOverlay: FC<ChatOverlayProps> = observer(function ChatOverlay({ visible = true }) {
  const { messages, error } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: 'https://pro.openagents.com/api/chat-app',
    onError: error => console.error(error, 'ERROR'),
  })

  const { recordingStore } = useStores()
  const { transcription } = recordingStore

  // When transcription changes, we could send it to the chat API here
  // This would require modifying the useChat hook to expose a method to add messages

  if (!visible) return null
  if (error) return <Text style={$errorText}>{error.message}</Text>

  return (
    <View style={$overlay}>
      <ScrollView style={$scrollView} contentContainerStyle={$scrollContent}>
        {messages.map(m => (
          <View key={m.id} style={$messageContainer}>
            <View>
              <Text style={$roleText}>{m.role}</Text>
              <Text style={$messageText}>{m.content}</Text>
            </View>
          </View>
        ))}
        {transcription && (
          <View style={$messageContainer}>
            <View>
              <Text style={$roleText}>user</Text>
              <Text style={$messageText}>{transcription}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
})

const $overlay: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 100, // Leave space for HudButtons
  backgroundColor: "rgba(0,0,0,0.5)",
  padding: 16,
}

const $scrollView: ViewStyle = {
  flex: 1,
}

const $scrollContent: ViewStyle = {
  flexGrow: 1,
  justifyContent: "flex-end",
}

const $messageContainer: ViewStyle = {
  marginVertical: 8,
}

const $roleText = {
  color: "#fff",
  fontWeight: "700" as const,
  marginBottom: 4,
}

const $messageText = {
  color: "#fff",
}

const $errorText = {
  color: "#ff0000",
}
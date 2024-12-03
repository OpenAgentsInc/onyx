import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import { FC, useState, useCallback } from "react"
import { ScrollView, View, ViewStyle, Pressable } from "react-native"
import { Text } from "@/components"
import { useChat } from "@ai-sdk/react"
import { useStores } from "@/models"
import { MessageMenu } from "./MessageMenu"

interface ChatOverlayProps {
  visible?: boolean
}

interface Message {
  id: string
  role: string
  content: string
}

export const ChatOverlay: FC<ChatOverlayProps> = observer(function ChatOverlay({ visible = true }) {
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const { messages, error } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: 'https://pro.openagents.com/api/chat-app',
    onError: error => console.error(error, 'ERROR'),
    onFinish: (message) => {
      setLocalMessages(prev => [...prev, message])
    },
  })

  const { recordingStore } = useStores()
  const { transcription, setTranscription } = recordingStore

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)

  // Update local messages when messages prop changes
  useState(() => {
    setLocalMessages(messages)
  }, [messages])

  const handleLongPress = useCallback((message: Message) => {
    console.log("Long press on message:", message)
    setSelectedMessage(message)
    setMenuVisible(true)
  }, [])

  const handleDeleteMessage = useCallback(() => {
    if (!selectedMessage) return
    
    console.log("Deleting message:", selectedMessage)
    
    // If it's a transcription message, clear it from the store
    if (selectedMessage.id === 'transcription') {
      setTranscription(null)
    } else {
      // Filter out the selected message from local messages
      setLocalMessages(prev => prev.filter(m => m.id !== selectedMessage.id))
    }
    
    setSelectedMessage(null)
  }, [selectedMessage, setTranscription])

  if (!visible) return null
  if (error) return <Text style={$errorText}>{error.message}</Text>

  return (
    <View style={$overlay}>
      <ScrollView style={$scrollView} contentContainerStyle={$scrollContent}>
        {localMessages.map(m => (
          <Pressable
            key={m.id}
            style={$messageContainer}
            onLongPress={() => handleLongPress(m)}
            delayLongPress={500}
          >
            <View>
              <Text style={$roleText}>{m.role}</Text>
              <Text style={$messageText}>{m.content}</Text>
            </View>
          </Pressable>
        ))}
        {transcription && (
          <Pressable
            style={$messageContainer}
            onLongPress={() => handleLongPress({
              id: 'transcription',
              role: 'user',
              content: transcription
            })}
            delayLongPress={500}
          >
            <View>
              <Text style={$roleText}>user</Text>
              <Text style={$messageText}>{transcription}</Text>
            </View>
          </Pressable>
        )}
      </ScrollView>

      <MessageMenu
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false)
          setSelectedMessage(null)
        }}
        onDelete={handleDeleteMessage}
      />
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
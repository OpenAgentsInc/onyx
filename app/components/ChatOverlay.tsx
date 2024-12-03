import { observer } from "mobx-react-lite"
import { FC, useState, useCallback, useEffect } from "react"
import { ScrollView, View, ViewStyle, Pressable } from "react-native"
import { Text } from "@/components"
import { MessageMenu } from "./MessageMenu"
import { useSharedChat, Message } from "@/hooks/useSharedChat"

interface ChatOverlayProps {
  visible?: boolean
}

export const ChatOverlay: FC<ChatOverlayProps> = observer(function ChatOverlay({ visible = true }) {
  const { messages, error } = useSharedChat()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('ChatOverlay messages changed:', {
      messagesExists: !!messages,
      isArray: Array.isArray(messages),
      length: messages?.length,
      messages
    })
  }, [messages])

  const handleLongPress = useCallback((message: Message) => {
    console.log("Long press on message:", message)
    setSelectedMessage(message)
    setMenuVisible(true)
  }, [])

  const handleDeleteMessage = useCallback(() => {
    if (!selectedMessage) return
    console.log("Deleting message:", selectedMessage)
    setSelectedMessage(null)
  }, [selectedMessage])

  if (!visible) {
    console.log('ChatOverlay not visible')
    return null
  }
  if (error) {
    console.log('ChatOverlay error:', error)
    return <Text style={$errorText}>{error.message}</Text>
  }

  const hasMessages = Array.isArray(messages) && messages.length > 0
  console.log('ChatOverlay rendering, hasMessages:', hasMessages)

  return (
    <View style={$overlay}>
      <ScrollView 
        style={$scrollView} 
        contentContainerStyle={$scrollContent}
      >
        {hasMessages ? (
          messages.map((message) => {
            console.log('Rendering message:', message)
            return (
              <Pressable
                key={message.id}
                style={$messageContainer}
                onLongPress={() => handleLongPress(message)}
                delayLongPress={500}
              >
                <View>
                  <Text style={$roleText}>{message.role}</Text>
                  <Text style={$messageText}>{message.content}</Text>
                </View>
              </Pressable>
            )
          })
        ) : (
          <View style={$messageContainer}>
            <Text style={$messageText}>No messages yet</Text>
          </View>
        )}
      </ScrollView>

      <MessageMenu
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false)
          setSelectedMessage(null)
        }}
        onDelete={handleDeleteMessage}
        messageContent={selectedMessage?.content || ''}
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
  zIndex: 1000, // Make sure overlay is on top
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
  backgroundColor: "rgba(0,0,0,0.3)", // Add some contrast
  padding: 12,
  borderRadius: 8,
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
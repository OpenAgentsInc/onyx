import { observer } from "mobx-react-lite"
import { FC, useState, useCallback } from "react"
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

  const handleLongPress = useCallback((message: Message) => {
    setSelectedMessage(message)
    setMenuVisible(true)
  }, [])

  const handleDeleteMessage = useCallback(() => {
    if (!selectedMessage) return
    setSelectedMessage(null)
  }, [selectedMessage])

  if (!visible) return null
  if (error) return <Text style={$errorText}>{error.message}</Text>

  return (
    <View style={$overlay}>
      <ScrollView 
        style={$scrollView} 
        contentContainerStyle={$scrollContent}
      >
        {messages.map((message) => (
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
        ))}
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
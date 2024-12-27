import { Text, View, TouchableOpacity, ScrollView } from "react-native"
import { colors, typography } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "@/models"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"

type Props = {
  drawerInsets: any // replace any with the correct type
  setOpen: (open: boolean) => void
}

export const ChatDrawerContent = observer(({ drawerInsets, setOpen }: Props) => {
  const { chatStore } = useStores()

  useEffect(() => {
    chatStore.loadAllChats()
  }, [])

  const handleNewChat = () => {
    // Generate a new conversation ID
    const newId = `chat_${Date.now()}`
    chatStore.setCurrentConversationId(newId)
    chatStore.clearMessages()
    setOpen(false) // Close the drawer after creating new chat
  }

  const handleSelectChat = (chatId: string) => {
    chatStore.setCurrentConversationId(chatId)
    setOpen(false)
  }

  const getChatPreview = (messages: any[]) => {
    if (!messages || messages.length === 0) {
      return "New Chat"
    }
    const lastUserMessage = messages
      .filter(msg => msg.role === "user")
      .pop()
    if (!lastUserMessage) {
      return "New Chat"
    }
    const preview = lastUserMessage.content.trim()
    if (preview.length <= 30) {
      return preview
    }
    return preview.slice(0, 30) + "..."
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        ...drawerInsets,
        borderRightWidth: 1,
        borderRightColor: colors.border,
      }}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity 
          onPress={handleNewChat}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
          <Text style={{ fontFamily: typography.primary.medium, color: "white", marginLeft: 12 }}>
            New chat
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {chatStore.allChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            onPress={() => handleSelectChat(chat.id)}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor: chatStore.currentConversationId === chat.id 
                ? colors.palette.neutral200 
                : "transparent",
            }}
          >
            <Text 
              style={{ 
                color: "white",
                fontFamily: typography.primary.medium,
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {getChatPreview(chat.messages)}
            </Text>
            <Text 
              style={{ 
                color: colors.palette.neutral400,
                fontSize: 12,
              }}
            >
              {new Date(chat.messages[0]?.createdAt || Date.now()).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
})
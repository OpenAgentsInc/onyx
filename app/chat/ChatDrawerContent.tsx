import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { colorsDark as colors, typography } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

type Props = {
  drawerInsets: any // replace any with the correct type
  setOpen: (open: boolean) => void
}

export const ChatDrawerContent = observer(({ drawerInsets, setOpen }: Props) => {
  const { chatStore } = useStores()
  const navigation = useNavigation()

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

  const handleWalletPress = () => {
    navigation.navigate("WalletScreen" as never)
    setOpen(false)
  }

  const getChatPreview = (messages: any[]) => {
    if (!messages || messages.length === 0) {
      return "New Chat"
    }
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()
    if (!lastUserMessage) {
      return "New Chat"
    }
    const preview = lastUserMessage.content.trim()
    if (preview.length <= 30) {
      return preview
    }
    return preview.slice(0, 30) + "..."
  }

  // Sort chats by creation time (using first message's timestamp or chat ID timestamp)
  const sortedChats = [...chatStore.allChats].sort((a, b) => {
    const aTime = a.messages[0]?.createdAt || parseInt(a.id.split("_")[1]) || 0
    const bTime = b.messages[0]?.createdAt || parseInt(b.id.split("_")[1]) || 0
    return bTime - aTime // Reverse chronological order
  })

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
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
          <Text style={{ fontFamily: typography.primary.medium, color: "white", marginLeft: 12 }}>
            New chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleWalletPress}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="wallet-outline" size={24} color="white" />
          <Text style={{ fontFamily: typography.primary.medium, color: "white", marginLeft: 12 }}>
            Wallet
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {sortedChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            onPress={() => handleSelectChat(chat.id)}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              backgroundColor:
                chatStore.currentConversationId === chat.id
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
              {new Date(
                chat.messages[0]?.createdAt || parseInt(chat.id.split("_")[1]) || Date.now(),
              ).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
})
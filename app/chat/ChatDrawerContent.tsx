import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { useStores } from "@/models"
import { colorsDark as colors, typography } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

type Props = {
  drawerInsets: any // replace any with the correct type
  setOpen: (open: boolean) => void
}

export const ChatDrawerContent = observer(({ drawerInsets, setOpen }: Props) => {
  const { chatStore, walletStore } = useStores()
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
    navigation.navigate("Wallet" as never)
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
    <View style={[styles.container, drawerInsets]}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
          <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
          <Text style={styles.buttonText}>New chat</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {sortedChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            onPress={() => handleSelectChat(chat.id)}
            style={[
              styles.chatItem,
              chatStore.currentConversationId === chat.id && styles.selectedChat,
            ]}
          >
            <Text style={styles.chatPreviewText} numberOfLines={1}>
              {getChatPreview(chat.messages)}
            </Text>
            <Text style={styles.dateText}>
              {new Date(
                chat.messages[0]?.createdAt || parseInt(chat.id.split("_")[1]) || Date.now(),
              ).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity onPress={handleWalletPress} style={styles.walletButton}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            Wallet (₿{walletStore.balanceSat}; {walletStore.nostrKeys?.npub.slice(0, 12)})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: typography.primary.medium,
    color: "white",
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "transparent",
  },
  selectedChat: {
    backgroundColor: colors.palette.neutral200,
  },
  chatPreviewText: {
    color: "white",
    fontFamily: typography.primary.medium,
    marginBottom: 4,
  },
  dateText: {
    color: colors.palette.neutral400,
    fontSize: 12,
  },
})
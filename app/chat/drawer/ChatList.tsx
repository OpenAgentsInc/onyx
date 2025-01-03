import { ScrollView, TouchableOpacity, Text } from "react-native"
import { useStores } from "@/models"
import { styles } from "./styles"
import { getChatPreview, sortChats } from "./ChatPreview"

type Props = {
  setOpen: (open: boolean) => void
}

export const ChatList = ({ setOpen }: Props) => {
  const { chatStore } = useStores()

  const handleSelectChat = (chatId: string) => {
    chatStore.setCurrentConversationId(chatId)
    setOpen(false)
  }

  const sortedChats = sortChats(chatStore.allChats)

  return (
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
  )
}
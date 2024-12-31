import { TouchableOpacity, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "@/models"
import { styles } from "./styles"

type Props = {
  setOpen: (open: boolean) => void
}

export const NewChatButton = ({ setOpen }: Props) => {
  const { chatStore } = useStores()

  const handleNewChat = () => {
    const newId = `chat_${Date.now()}`
    chatStore.setCurrentConversationId(newId)
    chatStore.clearMessages()
    setOpen(false)
  }

  return (
    <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
      <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
      <Text style={styles.buttonText}>New chat</Text>
    </TouchableOpacity>
  )
}
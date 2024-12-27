import { Text, View, TouchableOpacity } from "react-native"
import { colors, typography } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "@/models"

type Props = {
  drawerInsets: any // replace any with the correct type
}

export const ChatDrawerContent = ({ drawerInsets }: Props) => {
  const { chatStore } = useStores()

  const handleNewChat = () => {
    // Generate a new conversation ID
    const newId = `chat_${Date.now()}`
    chatStore.setCurrentConversationId(newId)
    chatStore.clearMessages()
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
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={handleNewChat}>
          <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
          <Text style={{ fontFamily: typography.primary.medium, color: "white", marginLeft: 12 }}>
            New chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
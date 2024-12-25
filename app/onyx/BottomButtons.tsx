import React from "react"
import { Image, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { colors } from "@/theme"
import { Ionicons } from "@expo/vector-icons"
import Clipboard from "@react-native-clipboard/clipboard"
import { styles } from "./BottomButtons.styles"

interface BottomButtonsProps {
  onTextPress: () => void
  onVoicePress: () => void
  onConfigurePress: () => void
  onToolsPress: () => void
}

export const BottomButtons = ({
  onTextPress,
  onVoicePress,
  onConfigurePress,
  onToolsPress,
}: BottomButtonsProps) => {
  const { chatStore } = useStores()

  const handleClearChat = () => {
    chatStore.clearMessages()
  }

  const handleCopyConversation = () => {
    const text = chatStore.conversationText
    Clipboard.setString(text)
  }

  return (
    <>
      {/* Tools Button */}
      <TouchableOpacity activeOpacity={0.8} onPress={onToolsPress} style={styles.toolsButton}>
        <Ionicons name="construct-outline" size={24} color={colors.textDim} />
      </TouchableOpacity>

      {/* Configure Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onConfigurePress}
        style={styles.configureButton}
      >
        <Ionicons name="settings-outline" size={24} color={colors.textDim} />
      </TouchableOpacity>

      {/* Copy Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCopyConversation}
        style={styles.copyButton}
      >
        <Ionicons name="copy-outline" size={24} color={colors.textDim} />
      </TouchableOpacity>

      {/* Trash Button */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleClearChat} style={styles.trashButton}>
        <Ionicons name="trash-outline" size={24} color={colors.textDim} />
      </TouchableOpacity>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity activeOpacity={0.8} onPress={onTextPress}>
          <Image
            source={require("../../assets/icons/text.png")}
            style={styles.iconButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={onVoicePress}>
          <Image
            source={require("../../assets/icons/voice.png")}
            style={styles.iconButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  )
}
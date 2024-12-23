import React from "react"
import { TouchableOpacity, View, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useStores } from "@/models"
import { styles } from "./BottomButtons.styles"

interface BottomButtonsProps {
  onTextPress: () => void
  onVoicePress: () => void
  onConfigurePress: () => void
}

export const BottomButtons = ({ onTextPress, onVoicePress, onConfigurePress }: BottomButtonsProps) => {
  const { chatStore } = useStores()

  const handleClearChat = () => {
    chatStore.clearMessages()
  }

  return (
    <>
      {/* Configure Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onConfigurePress}
        style={styles.configureButton}
      >
        <Image
          source={require("../../assets/icons/configure.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Trash Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleClearChat}
        style={styles.trashButton}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
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
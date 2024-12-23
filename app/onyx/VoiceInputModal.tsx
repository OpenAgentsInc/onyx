import React from "react"
import { Modal, TouchableOpacity, View, Text, Pressable } from "react-native"
import { styles as baseStyles } from "./styles"
import { styles as voiceStyles } from "./VoiceInputModal.styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { log } from "@/utils/log"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  transcript?: string
}

export const VoiceInputModal = observer(({ visible, onClose, transcript = "" }: VoiceInputModalProps) => {
  const { llmStore } = useStores()

  const handleSend = async () => {
    if (!transcript.trim()) return

    try {
      // Ensure context is initialized before proceeding
      if (!llmStore.context || !llmStore.isInitialized) {
        await llmStore.initContext()
      }

      await llmStore.chatCompletion(transcript)
      onClose()
    } catch (error) {
      log({
        name: "[VoiceInputModal]",
        preview: "Error sending message",
        value: error instanceof Error ? error.message : "Unknown error",
        important: true
      })
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalHeader}>
          <Pressable onPress={onClose}>
            <Text style={[baseStyles.buttonText, baseStyles.cancelText]}>Cancel</Text>
          </Pressable>

          <Pressable onPress={handleSend} disabled={!transcript.trim() || llmStore.inferencing}>
            <Text style={[
              baseStyles.buttonText,
              !transcript.trim() || llmStore.inferencing ? baseStyles.disabledText : baseStyles.sendText
            ]}>
              {llmStore.inferencing ? "Sending..." : "Send"}
            </Text>
          </Pressable>
        </View>

        <View style={voiceStyles.voiceContainer}>
          <View style={voiceStyles.transcriptionContainer}>
            <Text style={voiceStyles.listeningText}>Listening...</Text>
            {transcript ? (
              <Text style={voiceStyles.transcriptionText}>{transcript}</Text>
            ) : (
              <Text style={voiceStyles.placeholderText}>Start speaking...</Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
})
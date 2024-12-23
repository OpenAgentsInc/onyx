import React from "react"
import { Modal, TouchableOpacity, View, Text } from "react-native"
import { styles as baseStyles } from "./styles"
import { styles as voiceStyles } from "./VoiceInputModal.styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { log } from "@/utils/log"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  transcript?: string // Make transcript optional
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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalContent}>
          <Text style={voiceStyles.transcriptionText}>{transcript}</Text>
          <View style={baseStyles.modalHeader}>
            <TouchableOpacity
              style={[baseStyles.button, baseStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[baseStyles.buttonText, baseStyles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[baseStyles.button, baseStyles.sendButton]}
              onPress={handleSend}
              disabled={!transcript.trim() || llmStore.inferencing}
            >
              <Text style={[
                baseStyles.buttonText,
                !transcript.trim() || llmStore.inferencing ? baseStyles.disabledText : baseStyles.sendText
              ]}>
                {llmStore.inferencing ? "Sending..." : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
})
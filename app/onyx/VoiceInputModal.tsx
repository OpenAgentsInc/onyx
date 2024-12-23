import React from "react"
import { Modal, TouchableOpacity, View, Text } from "react-native"
import { styles } from "./styles"
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.transcriptionText}>{transcript}</Text>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={handleSend}
              disabled={!transcript.trim() || llmStore.inferencing}
            >
              <Text style={[
                styles.buttonText,
                !transcript.trim() || llmStore.inferencing ? styles.disabledText : styles.sendText
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
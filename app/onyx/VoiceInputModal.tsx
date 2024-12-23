import React, { useState } from "react"
import { Modal, Text, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { log } from "@/utils/log"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
}

export const VoiceInputModal = observer(({ visible, onClose }: VoiceInputModalProps) => {
  const { llmStore } = useStores()
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")

  const handleSend = async () => {
    if (!transcribedText.trim()) return

    try {
      await llmStore.chatCompletion(transcribedText)
      setTranscribedText("")
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

  const handleStartRecording = () => {
    setIsRecording(true)
    // TODO: Implement voice recording
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // TODO: Implement voice recording stop
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
          <View style={styles.voiceContainer}>
            <TouchableOpacity
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <View style={styles.transcriptionContainer}>
                <Text style={styles.listeningText}>{isRecording ? "Listening" : "Paused"}</Text>
                {transcribedText ? (
                  <Text style={styles.transcriptionText}>{transcribedText}</Text>
                ) : (
                  <Text style={styles.placeholderText}>Start speaking...</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

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
              disabled={!transcribedText.trim() || llmStore.inferencing}
            >
              <Text style={[
                styles.buttonText,
                !transcribedText.trim() || llmStore.inferencing ? styles.disabledText : styles.sendText
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
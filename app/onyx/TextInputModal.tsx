import React, { useState } from "react"
import { Modal, TextInput, TouchableOpacity, View, Text } from "react-native"
import { styles } from "./styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { log } from "@/utils/log"

interface TextInputModalProps {
  visible: boolean
  onClose: () => void
}

export const TextInputModal = observer(({ visible, onClose }: TextInputModalProps) => {
  const { llmStore } = useStores()
  const [text, setText] = useState("")

  const handleSend = async () => {
    if (!text.trim()) return

    try {
      await llmStore.chatCompletion(text)
      setText("")
      onClose()
    } catch (error) {
      log({
        name: "[TextInputModal]",
        preview: "Error sending message",
        value: error,
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
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type your message..."
            placeholderTextColor="#666"
            multiline
            autoFocus
          />
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
              disabled={!text.trim() || llmStore.inferencing}
            >
              <Text style={[
                styles.buttonText,
                !text.trim() || llmStore.inferencing ? styles.disabledText : styles.sendText
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
import React, { useState } from "react"
import { Modal, TextInput, TouchableOpacity, View, Text } from "react-native"
import { styles as baseStyles } from "./styles"
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
      // Ensure context is initialized before proceeding
      if (!llmStore.context || !llmStore.isInitialized) {
        await llmStore.initContext()
      }

      await llmStore.chatCompletion(text)
      setText("")
      onClose()
    } catch (error) {
      log({
        name: "[TextInputModal]",
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
          <TextInput
            style={baseStyles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type your message..."
            placeholderTextColor="#666"
            multiline
            autoFocus
          />
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
              disabled={!text.trim() || llmStore.inferencing}
            >
              <Text style={[
                baseStyles.buttonText,
                !text.trim() || llmStore.inferencing ? baseStyles.disabledText : baseStyles.sendText
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
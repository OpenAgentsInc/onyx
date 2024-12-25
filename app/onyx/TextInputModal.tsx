import React, { useState } from "react"
import { Modal, TextInput, View, Text, Pressable } from "react-native"
import { styles as baseStyles } from "./styles"
import { observer } from "mobx-react-lite"
import { log } from "@/utils/log"

interface TextInputModalProps {
  visible: boolean
  onClose: () => void
  onSendMessage: (message: string) => Promise<void>
}

export const TextInputModal = observer(({ visible, onClose, onSendMessage }: TextInputModalProps) => {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSend = async () => {
    if (!text.trim()) return

    try {
      const messageToSend = text // Capture current text
      setText("") // Clear input
      onClose() // Close modal immediately
      setIsGenerating(true)

      // Send message after modal is closed
      await onSendMessage(messageToSend)
    } catch (error) {
      log({
        name: "[TextInputModal]",
        preview: "Error sending message",
        value: error instanceof Error ? error.message : "Unknown error",
        important: true
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const isDisabled = !text.trim() || isGenerating

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

          <Pressable onPress={handleSend} disabled={isDisabled}>
            <Text style={[
              baseStyles.buttonText,
              isDisabled ? baseStyles.disabledText : baseStyles.sendText
            ]}>
              Send
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={baseStyles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          multiline
          autoFocus
        />
      </View>
    </Modal>
  )
})
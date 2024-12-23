import { useState } from "react"
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native"
import { styles } from "./styles"
import { useChatStore } from "./hooks/useChatStore"

interface TextInputModalProps {
  visible: boolean
  onClose: () => void
  onSend: (text: string) => void
}

export const TextInputModal = ({ visible, onClose, onSend }: TextInputModalProps) => {
  const [inputText, setInputText] = useState("")
  const { isInferencing, error } = useChatStore()

  const handleCancel = () => {
    setInputText("")
    onClose()
  }

  const handleSend = async () => {
    const textToSend = inputText.trim()
    if (textToSend) {
      setInputText("")
      await onSend(textToSend)
    }
    onClose()
  }

  const isDisabled = !inputText.trim() || isInferencing

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelText]}>
                Cancel
              </Text>
            </Pressable>
            
            <Pressable onPress={handleSend} disabled={isDisabled}>
              {isInferencing ? (
                <ActivityIndicator size="small" color="#0A84FF" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    isDisabled ? styles.disabledText : styles.sendText,
                  ]}
                >
                  Send
                </Text>
              )}
            </Pressable>
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TextInput
            style={[
              styles.input,
              isInferencing && styles.disabledInput
            ]}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            autoFocus
            multiline
            value={inputText}
            onChangeText={setInputText}
            editable={!isInferencing}
          />
        </View>
      </View>
    </Modal>
  )
}
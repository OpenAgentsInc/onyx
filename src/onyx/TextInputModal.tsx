import { useState } from "react"
import { Modal, Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import { styles } from "./styles"

interface TextInputModalProps {
  visible: boolean
  onClose: () => void
  onSend: (text: string) => void
}

export const TextInputModal = ({ visible, onClose, onSend }: TextInputModalProps) => {
  const [inputText, setInputText] = useState("")

  const handleCancel = () => {
    setInputText("")
    onClose()
  }

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText.trim())
      setInputText("")
    }
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelText]}>
                Cancel
              </Text>
            </Pressable>
            
            <Pressable onPress={handleSend}>
              <Text
                style={[
                  styles.buttonText,
                  inputText.trim() ? styles.sendText : styles.disabledText,
                ]}
              >
                Send
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            autoFocus
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}
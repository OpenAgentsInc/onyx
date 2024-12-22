import { Modal, Pressable, Text, View } from "react-native"
import { styles } from "./styles"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  onSend: (audioData: any) => void // TODO: Define proper audio data type
}

export const VoiceInputModal = ({ visible, onClose, onSend }: VoiceInputModalProps) => {
  const handleCancel = () => {
    // TODO: Stop recording if in progress
    onClose()
  }

  const handleSend = () => {
    // TODO: Implement voice recording handling
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={handleCancel}>
            <Text style={[styles.buttonText, styles.cancelText]}>
              Cancel
            </Text>
          </Pressable>
          
          <Pressable onPress={handleSend}>
            <Text style={[styles.buttonText, styles.disabledText]}>
              Send
            </Text>
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={[styles.buttonText, styles.sendText]}>
            Recording... (TODO)
          </Text>
        </View>
      </View>
    </Modal>
  )
}
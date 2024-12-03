import React from "react"
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Pressable,
  StyleSheet,
  Clipboard
} from "react-native"
import { VectorIcon } from "./VectorIcon"
import { colors } from "@/theme/colorsDark"

interface TranscriptionModalProps {
  visible: boolean
  text: string
  onClose: () => void
}

export function TranscriptionModal({ 
  visible, 
  text, 
  onClose 
}: TranscriptionModalProps) {
  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(text)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Transcription</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <VectorIcon name="close" size={24} color={colors.palette.neutral100} />
            </TouchableOpacity>
          </View>
          <Text style={styles.transcriptionText}>
            {text}
          </Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={copyToClipboard}
          >
            <VectorIcon name="content-copy" size={20} color={colors.palette.neutral100} />
            <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.palette.neutral900,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: colors.palette.neutral700,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.palette.neutral800,
    paddingBottom: 10,
  },
  modalTitle: {
    color: colors.palette.neutral100,
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  transcriptionText: {
    color: colors.palette.neutral100,
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.palette.neutral800,
    padding: 12,
    borderRadius: 8,
    marginTop: "auto",
    borderWidth: 1,
    borderColor: colors.palette.neutral700,
  },
  copyButtonText: {
    color: colors.palette.neutral100,
    marginLeft: 8,
    fontSize: 16,
  },
})
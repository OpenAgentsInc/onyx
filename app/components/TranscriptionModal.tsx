import React from "react"
import {
  Clipboard, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View
} from "react-native"
import { colors } from "@/theme/colorsDark"
import { typography } from "@/theme/typography"
import { VectorIcon } from "./VectorIcon"

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
              <VectorIcon name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.transcriptionText}>
            {text}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={copyToClipboard}
          >
            <VectorIcon name="content-copy" size={20} color="white" />
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
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 10,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.primary.semiBold,
  },
  closeButton: {
    padding: 5,
  },
  transcriptionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: typography.primary.normal,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: "auto",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  copyButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
})

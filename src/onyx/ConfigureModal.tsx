import React, { useState } from "react"
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { typography } from "@/theme"
import { colors } from "@/theme/colors"

// Demo data
const DEMO_MODELS = {
  "1B": {
    displayName: "Onyx 1B",
    size: "770 MB",
    status: "downloaded"
  },
  "7B": {
    displayName: "Onyx 7B",
    size: "2 GB",
    status: "not_downloaded"
  }
}

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = ({ visible, onClose }: ConfigureModalProps) => {
  const [selectedModel, setSelectedModel] = useState("1B")

  const handleModelSelect = (modelKey: string) => {
    setSelectedModel(modelKey)
  }

  const handleDownload = (modelKey: string) => {
    console.log("Download requested for model:", modelKey)
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Configure Onyx</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButtonText}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Selection</Text>
            {Object.entries(DEMO_MODELS).map(([key, model]) => (
              <View key={key} style={styles.modelItem}>
                <View style={styles.modelInfo}>
                  <Text style={styles.modelName}>
                    {model.displayName}
                    {key === selectedModel && <Text style={styles.activeIndicator}> ✓</Text>}
                  </Text>
                  <Text style={styles.modelSize}>{model.size}</Text>
                </View>
                {model.status === "downloaded" ? (
                  <TouchableOpacity
                    onPress={() => handleModelSelect(key)}
                    style={[
                      styles.actionButton,
                      key === selectedModel && styles.selectedButton
                    ]}
                  >
                    <Text style={[
                      styles.actionButtonText,
                      key === selectedModel && styles.selectedButtonText
                    ]}>
                      {key === selectedModel ? "Selected" : "Select"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDownload(key)}
                    style={styles.downloadButton}
                  >
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>
            <View style={styles.storageInfo}>
              <Text style={styles.storageText}>Used: 770 MB</Text>
              <Text style={styles.storageText}>Available: 12.3 GB</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: colors.background,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: typography.primary.medium,
  },
  closeButtonText: {
    color: colors.tint,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    color: colors.textDim,
    fontSize: 14,
    fontFamily: typography.primary.medium,
    marginBottom: 12,
  },
  modelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modelInfo: {
    flex: 1,
    marginRight: 16,
  },
  modelName: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.primary.normal,
  },
  activeIndicator: {
    color: colors.tint,
  },
  modelSize: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 90,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  selectedButtonText: {
    color: colors.background,
  },
  downloadButton: {
    backgroundColor: colors.tint,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  downloadButtonText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  storageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  storageText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.primary.normal,
  },
})
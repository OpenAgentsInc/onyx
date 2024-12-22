import React, { useState } from "react"
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import { typography } from "@/theme"
import { colors } from "@/theme/colors"
import { AVAILABLE_MODELS, DEFAULT_MODEL_KEY } from "@/screens/Chat/constants"
import { styles } from "./styles"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = ({ visible, onClose }: ConfigureModalProps) => {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_KEY)

  const handleModelSelect = (modelKey: string) => {
    setSelectedModel(modelKey)
  }

  const handleDownload = (modelKey: string) => {
    console.log("Download requested for model:", modelKey)
  }

  // Demo function to determine if a model is downloaded
  const isModelDownloaded = (modelKey: string) => {
    return modelKey === "1B" // For demo, only 1B is "downloaded"
  }

  // Helper to get model size
  const getModelSize = (modelKey: string) => {
    return modelKey === "1B" ? "770 MB" : "2.1 GB"
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.configureModalContent}>
          <View style={styles.configureHeader}>
            <Text style={styles.headerTitle}>Configure Onyx</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButtonText}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Selection</Text>
            {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
              <View key={key} style={styles.modelItem}>
                <View style={styles.modelInfo}>
                  <Text style={styles.modelName}>
                    {model.displayName}
                    {key === selectedModel && <Text style={styles.activeIndicator}> ✓</Text>}
                  </Text>
                  <Text style={styles.modelSize}>{getModelSize(key)}</Text>
                </View>
                {isModelDownloaded(key) ? (
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
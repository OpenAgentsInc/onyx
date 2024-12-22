import { observer } from "mobx-react-lite"
import React from "react"
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useStores } from "@/models"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"
import { styles } from "./styles"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = observer(function ConfigureModal({
  visible,
  onClose,
}: ConfigureModalProps) {
  const { llmStore } = useStores()

  const handleDeleteModel = async (modelKey: string) => {
    const model = AVAILABLE_MODELS[modelKey]
    Alert.alert(
      "Delete Model?",
      `Delete ${model.displayName}? You'll need to download it again to use it.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await llmStore.deleteModel(modelKey)
            } catch (error) {
              Alert.alert("Error", "Failed to delete model file")
            }
          },
        },
      ],
    )
  }

  const handleSelectModel = (modelKey: string) => {
    llmStore.selectModel(modelKey)
    onClose()
  }

  const handleDownloadPress = (modelKey: string) => {
    llmStore.startModelDownload(modelKey)
  }

  const handleCancelDownload = (modelKey: string) => {
    llmStore.cancelModelDownload(modelKey)
  }

  const isModelDownloaded = (modelKey: string) => {
    const model = llmStore.models.find((m) => m.key === modelKey)
    return model?.status === "ready"
  }

  const getModelSize = (modelKey: string): string => {
    return modelKey === "1B" ? "770 MB" : "2.1 GB"
  }

  const getModelStatus = (modelKey: string) => {
    const model = llmStore.models.find((m) => m.key === modelKey)
    return model?.status || "idle"
  }

  const getModelProgress = (modelKey: string) => {
    const model = llmStore.models.find((m) => m.key === modelKey)
    return model?.progress || 0
  }

  const getModelError = (modelKey: string) => {
    const model = llmStore.models.find((m) => m.key === modelKey)
    return model?.error
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Configure Onyx</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {llmStore.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{llmStore.error}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Model Selection</Text>
              {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
                const status = getModelStatus(key)
                const progress = getModelProgress(key)
                const modelError = getModelError(key)
                const downloaded = isModelDownloaded(key)
                const isActive = key === llmStore.selectedModelKey
                const isDownloading = status === "downloading"

                return (
                  <View key={key} style={styles.modelItem}>
                    <TouchableOpacity
                      style={styles.modelInfo}
                      onPress={() => downloaded && handleSelectModel(key)}
                      disabled={!downloaded || isDownloading}
                    >
                      <View style={styles.modelNameContainer}>
                        <Text style={styles.modelName}>
                          {model.displayName}
                          {isActive && <Text style={styles.activeIndicator}> ✓</Text>}
                        </Text>
                        {modelError && <Text style={styles.modelError}>{modelError}</Text>}
                      </View>
                      <Text style={styles.modelSize}>
                        {isDownloading ? `${progress}%` : getModelSize(key)}
                      </Text>
                    </TouchableOpacity>

                    {downloaded ? (
                      <TouchableOpacity
                        onPress={() => handleDeleteModel(key)}
                        style={styles.deleteButton}
                        disabled={isDownloading}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.downloadContainer}>
                        {isDownloading ? (
                          <>
                            <ActivityIndicator size="small" color="#007AFF" />
                            <TouchableOpacity
                              onPress={() => handleCancelDownload(key)}
                              style={styles.cancelButton}
                            >
                              <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity
                            onPress={() => handleDownloadPress(key)}
                            style={styles.downloadButton}
                          >
                            <Text style={styles.downloadButtonText}>Download</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
})

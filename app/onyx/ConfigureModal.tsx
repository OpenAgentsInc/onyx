import React from "react"
import { Modal, ScrollView, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native"
import { styles as configureStyles } from "./ConfigureModal.styles"
import { styles as baseStyles } from "./styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { AVAILABLE_MODELS } from "@/services/local-models/constants"

// Model sizes with proper type definition
const MODEL_SIZES: Record<string, string> = {
  "1B": "770 MB",
  "3B": "2.1 GB"
}

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = observer(({ visible, onClose }: ConfigureModalProps) => {
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
    return MODEL_SIZES[modelKey] || "Unknown"
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
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={configureStyles.modalContent}>
        <View style={configureStyles.modalHeader}>
          <Text style={configureStyles.headerTitle}>Configure Onyx</Text>
          <TouchableOpacity onPress={onClose} style={configureStyles.closeButton}>
            <Text style={configureStyles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {llmStore.error && (
            <View style={baseStyles.errorContainer}>
              <Text style={baseStyles.errorText}>{llmStore.error}</Text>
            </View>
          )}

          <View style={configureStyles.section}>
            <Text style={configureStyles.sectionTitle}>Model Selection</Text>
            {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
              const status = getModelStatus(key)
              const progress = getModelProgress(key)
              const modelError = getModelError(key)
              const downloaded = isModelDownloaded(key)
              const isActive = key === llmStore.selectedModelKey
              const isDownloading = status === "downloading"

              return (
                <View key={key} style={configureStyles.modelItem}>
                  <TouchableOpacity
                    style={configureStyles.modelInfo}
                    onPress={() => downloaded && handleSelectModel(key)}
                    disabled={!downloaded || isDownloading}
                  >
                    <View style={configureStyles.modelNameContainer}>
                      <Text style={configureStyles.modelName}>
                        {model.displayName}
                        {isActive && <Text style={configureStyles.activeIndicator}> ✓</Text>}
                      </Text>
                      {modelError && <Text style={configureStyles.modelError}>{modelError}</Text>}
                    </View>
                    <Text style={configureStyles.modelSize}>
                      {isDownloading ? `${progress.toFixed(1)}%` : getModelSize(key)}
                    </Text>
                  </TouchableOpacity>

                  {downloaded ? (
                    <View style={configureStyles.downloadContainer}>
                      <TouchableOpacity
                        onPress={() => handleDeleteModel(key)}
                        style={configureStyles.deleteButton}
                        disabled={isDownloading}
                      >
                        <Text style={configureStyles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={configureStyles.downloadContainer}>
                      {isDownloading ? (
                        <>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                          <TouchableOpacity
                            onPress={() => handleCancelDownload(key)}
                            style={configureStyles.cancelButton}
                          >
                            <Text style={configureStyles.cancelButtonText}>Cancel</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <View style={configureStyles.downloadContainer}>
                          <TouchableOpacity
                            onPress={() => handleDownloadPress(key)}
                            style={configureStyles.downloadButton}
                          >
                            <Text style={configureStyles.downloadButtonText}>Download</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
})
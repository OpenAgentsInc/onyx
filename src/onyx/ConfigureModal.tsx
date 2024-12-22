import * as FileSystem from "expo-file-system"
import React, { useEffect, useState } from "react"
import { Alert, Modal, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"
import { useModelStore } from "@/store/useModelStore"
import { styles } from "./styles"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = ({ visible, onClose }: ConfigureModalProps) => {
  const [modelFiles, setModelFiles] = useState<string[]>([])

  const {
    selectedModelKey,
    models,
    error,
    startModelDownload,
    cancelModelDownload,
    deleteModel,
    selectModel,
  } = useModelStore()

  const modelsDir = `${FileSystem.cacheDirectory}models`

  const loadModelFiles = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(modelsDir)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true })
        setModelFiles([])
        return
      }
      const files = await FileSystem.readDirectoryAsync(modelsDir)
      setModelFiles(files)
    } catch (error) {
      console.error("Failed to load model files:", error)
    }
  }

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
              await deleteModel(modelKey)
              await loadModelFiles()
            } catch (error) {
              Alert.alert("Error", "Failed to delete model file")
            }
          },
        },
      ],
    )
  }

  const handleSelectModel = (modelKey: string) => {
    selectModel(modelKey)
    onClose()
  }

  const handleDownloadPress = (modelKey: string) => {
    startModelDownload(modelKey)
  }

  const handleCancelDownload = (modelKey: string) => {
    cancelModelDownload(modelKey)
  }

  useEffect(() => {
    if (visible) {
      loadModelFiles()
    }
  }, [visible])

  useEffect(() => {
    loadModelFiles()
  }, [models])

  const isModelDownloaded = (modelKey: string) => {
    const model = models.find(m => m.key === modelKey)
    return model?.status === 'ready'
  }

  const getModelSize = (modelKey: string): string => {
    return modelKey === "1B" ? "770 MB" : "2.1 GB"
  }

  const getModelStatus = (modelKey: string) => {
    const model = models.find(m => m.key === modelKey)
    return model?.status || 'idle'
  }

  const getModelProgress = (modelKey: string) => {
    const model = models.find(m => m.key === modelKey)
    return model?.progress || 0
  }

  const getModelError = (modelKey: string) => {
    const model = models.find(m => m.key === modelKey)
    return model?.error
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Configure Onyx</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Selection</Text>
            {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
              const status = getModelStatus(key)
              const progress = getModelProgress(key)
              const modelError = getModelError(key)
              const downloaded = isModelDownloaded(key)
              const isActive = key === selectedModelKey
              const isDownloading = status === 'downloading'

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
                      {modelError && (
                        <Text style={styles.modelError}>{modelError}</Text>
                      )}
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
        </View>
      </View>
    </Modal>
  )
}
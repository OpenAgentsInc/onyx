import React, { useEffect, useState } from "react"
import {
  Alert, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from "react-native"
import * as FileSystem from 'expo-file-system'
import { getCurrentModelConfig, useModelStore } from "@/store/useModelStore"
import { typography } from "@/theme"
import { colors } from "@/theme/colors"
import { AVAILABLE_MODELS } from "../constants"

interface ModelFile {
  name: string
  size: string
  path: string
  modelKey: string
}

interface ModelFileManagerProps {
  visible: boolean
  onClose: () => void
  onDownloadModel: (modelKey: string) => void
  embedded?: boolean
}

export const ModelFileManager: React.FC<ModelFileManagerProps> = ({
  visible,
  onClose,
  onDownloadModel,
  embedded = false
}) => {
  const [modelFiles, setModelFiles] = useState<ModelFile[]>([])
  const { selectedModelKey, status, progress, selectModel, startInitialization } = useModelStore()
  const modelsDir = `${FileSystem.cacheDirectory}models`

  const loadModelFiles = async () => {
    try {
      // Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(modelsDir)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true })
        setModelFiles([])
        return
      }

      // Read directory contents
      const files = await FileSystem.readDirectoryAsync(modelsDir)
      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const path = `${modelsDir}/${filename}`
          const info = await FileSystem.getInfoAsync(path, { size: true })
          const sizeMB = info.exists && info.size ? (info.size / (1024 * 1024)).toFixed(1) : '0'

          const modelKey = Object.entries(AVAILABLE_MODELS).find(
            ([_, model]) => model.filename === filename
          )?.[0] || ''

          return {
            name: filename,
            size: `${sizeMB} MB`,
            path,
            modelKey
          }
        })
      )
      setModelFiles(fileDetails)
    } catch (error) {
      console.error('Failed to load model files:', error)
    }
  }

  const handleDeleteModel = async (modelKey: string) => {
    const model = AVAILABLE_MODELS[modelKey]
    Alert.alert(
      "Delete Model?",
      `Delete ${model.displayName.replace(' Instruct', '')}? You'll need to download it again to use it.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const filePath = `${modelsDir}/${model.filename}`
              await FileSystem.deleteAsync(filePath)
              await loadModelFiles() // Refresh list
            } catch (error) {
              console.error('Failed to delete model file:', error)
              Alert.alert('Error', 'Failed to delete model file')
            }
          }
        }
      ]
    )
  }

  const handleSelectModel = async (modelKey: string) => {
    // First select the model in the store
    selectModel(modelKey)
    
    // Get the model file path
    const model = AVAILABLE_MODELS[modelKey]
    const filePath = `${modelsDir}/${model.filename}`
    
    // Start initialization
    startInitialization()
    
    // Close the modal
    onClose()
  }

  useEffect(() => {
    if (visible || embedded) {
      loadModelFiles()
    }
  }, [visible, embedded])

  const isModelDownloaded = (modelKey: string) => {
    return modelFiles.some(file => file.modelKey === modelKey)
  }

  const getModelSize = (modelKey: string): string => {
    const file = modelFiles.find(file => file.modelKey === modelKey)
    return file ? file.size : modelKey === '1B' ? '770 MB' : '1.9 GB'
  }

  const isModelActive = (modelKey: string) => {
    return modelKey === selectedModelKey && status === 'ready'
  }

  const isDownloading = status === 'downloading'

  const content = (
    <View style={styles.container}>
      {/* Available Models Section */}
      <View style={styles.section}>
        {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
          const downloaded = isModelDownloaded(key)
          const active = isModelActive(key)
          const displayName = model.displayName.replace(' Instruct', '')
          const downloading = isDownloading && key === selectedModelKey

          return (
            <View key={key} style={styles.modelItem}>
              <TouchableOpacity
                style={styles.modelInfo}
                onPress={() => downloaded && handleSelectModel(key)}
                disabled={!downloaded || isDownloading}
              >
                <Text style={styles.modelName}>
                  {displayName}
                  {active && <Text style={styles.activeIndicator}> ✓</Text>}
                </Text>
                <Text style={styles.modelSize}>
                  {downloading ? `Downloading... ${progress}%` : getModelSize(key)}
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
                <TouchableOpacity
                  onPress={() => onDownloadModel(key)}
                  style={[
                    styles.downloadButton,
                    downloading && styles.downloadingButton
                  ]}
                  disabled={isDownloading}
                >
                  <Text style={styles.downloadButtonText}>
                    {downloading ? `${progress}%` : 'Download'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )

  if (embedded) {
    return content
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => !isDownloading && onClose()}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Models</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                isDownloading && styles.closeButtonDisabled
              ]}
              disabled={isDownloading}
            >
              <Text style={[
                styles.closeButtonText,
                isDownloading && styles.closeButtonTextDisabled
              ]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {content}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonDisabled: {
    opacity: 0.5,
  },
  closeButtonText: {
    color: colors.tint,
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  closeButtonTextDisabled: {
    color: colors.textDim,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modelInfo: {
    flex: 1,
    marginRight: 16,
  },
  modelName: {
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 14,
  },
  activeIndicator: {
    color: colors.tint,
    fontFamily: typography.primary.medium,
  },
  modelSize: {
    color: colors.textDim,
    fontFamily: typography.primary.normal,
    fontSize: 12,
    marginTop: 2,
  },
  downloadButton: {
    backgroundColor: colors.tint,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  downloadingButton: {
    backgroundColor: colors.palette.neutral300,
  },
  downloadButtonText: {
    color: colors.background,
    fontFamily: typography.primary.medium,
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: colors.errorBackground,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontFamily: typography.primary.medium,
    fontSize: 12,
  },
})
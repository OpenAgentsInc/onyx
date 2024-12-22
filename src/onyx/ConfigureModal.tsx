import React, { useEffect, useState } from "react"
import { Alert, Modal, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import * as FileSystem from 'expo-file-system'
import { useModelStore } from "@/store/useModelStore"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"
import { styles } from "./styles"

interface ConfigureModalProps {
  visible: boolean
  onClose: () => void
}

export const ConfigureModal = ({ visible, onClose }: ConfigureModalProps) => {
  const [modelFiles, setModelFiles] = useState<string[]>([])
  const { 
    selectedModelKey, 
    status, 
    progress, 
    selectModel, 
    startInitialization,
    deleteModel,
    confirmDeletion,
    startDownload
  } = useModelStore()

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
      setModelFiles(files)
    } catch (error) {
      console.error('Failed to load model files:', error)
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
              console.log(`[Model Delete] Starting deletion process for ${modelKey}`)
              const filePath = `${modelsDir}/${model.filename}`
              
              // First notify store to handle any context release
              deleteModel(modelKey)
              
              // Wait a bit for context release if needed
              await new Promise(resolve => setTimeout(resolve, 500))
              
              // Delete the file
              console.log(`[Model Delete] Deleting file: ${filePath}`)
              await FileSystem.deleteAsync(filePath)
              
              // Confirm deletion in store
              confirmDeletion(modelKey)
              
              // Refresh list
              await loadModelFiles()
              
              console.log(`[Model Delete] Successfully deleted model: ${modelKey}`)
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
    
    // Start initialization
    startInitialization()
    
    // Close the modal
    onClose()
  }

  const handleDownloadPress = (modelKey: string) => {
    // First select the model
    selectModel(modelKey)
    
    // Start download
    startDownload()
    
    // Close the modal
    onClose()
  }

  useEffect(() => {
    if (visible) {
      loadModelFiles()
    }
  }, [visible])

  // Refresh list when model status changes
  useEffect(() => {
    if (status === 'idle') {
      loadModelFiles()
    }
  }, [status])

  const isModelDownloaded = (modelKey: string) => {
    const model = AVAILABLE_MODELS[modelKey]
    return modelFiles.includes(model.filename)
  }

  const getModelSize = (modelKey: string): string => {
    return modelKey === '1B' ? '770 MB' : '2.1 GB'
  }

  const isModelActive = (modelKey: string) => {
    return modelKey === selectedModelKey && status === 'ready'
  }

  const isDownloading = status === 'downloading'

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => !isDownloading && onClose()}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.configureModalContent}>
          <View style={styles.configureHeader}>
            <Text style={styles.headerTitle}>Configure Onyx</Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Selection</Text>
            {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
              const downloaded = isModelDownloaded(key)
              const active = isModelActive(key)
              const downloading = isDownloading && key === selectedModelKey

              return (
                <View key={key} style={styles.modelItem}>
                  <TouchableOpacity
                    style={styles.modelInfo}
                    onPress={() => downloaded && handleSelectModel(key)}
                    disabled={!downloaded || isDownloading}
                  >
                    <Text style={styles.modelName}>
                      {model.displayName}
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
                      onPress={() => handleDownloadPress(key)}
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>
            <View style={styles.storageInfo}>
              <Text style={styles.storageText}>Used: 770 MB</Text>
              <Text style={styles.storageText}>Available: 12.3 GB</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
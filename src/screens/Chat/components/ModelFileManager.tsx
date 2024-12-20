import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, SafeAreaView } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { typography } from '@/theme'
import { colors } from '@/theme/colors'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { AVAILABLE_MODELS } from '../constants'

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
  const downloader = new ModelDownloader()
  const { selectedModelKey, modelPath, status, selectModel } = useModelStore()

  const loadModelFiles = async () => {
    try {
      await downloader.ensureDirectory()
      const files = await ReactNativeBlobUtil.fs.ls(downloader.cacheDir)
      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const path = `${downloader.cacheDir}/${filename}`
          const stats = await ReactNativeBlobUtil.fs.stat(path)
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(1)
          
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
              const filePath = `${downloader.cacheDir}/${model.filename}`
              await ReactNativeBlobUtil.fs.unlink(filePath)
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

  const handleSelectModel = (modelKey: string) => {
    selectModel(modelKey)
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
    return file ? file.size : modelKey === '1B' ? '~1GB' : '~2GB'
  }

  const isModelActive = (modelKey: string) => {
    return modelKey === selectedModelKey && status === 'ready'
  }

  const content = (
    <View style={styles.container}>
      {/* Available Models Section */}
      <View style={styles.section}>
        {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
          const downloaded = isModelDownloaded(key)
          const active = isModelActive(key)
          const displayName = model.displayName.replace(' Instruct', '')
          
          return (
            <View key={key} style={styles.modelItem}>
              <TouchableOpacity 
                style={styles.modelInfo}
                onPress={() => downloaded && handleSelectModel(key)}
                disabled={!downloaded}
              >
                <Text style={styles.modelName}>
                  {displayName}
                  {active && <Text style={styles.activeIndicator}> ✓</Text>}
                </Text>
                <Text style={styles.modelSize}>
                  {getModelSize(key)}
                </Text>
              </TouchableOpacity>
              {downloaded ? (
                <TouchableOpacity
                  onPress={() => handleDeleteModel(key)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onDownloadModel(key)}
                  style={styles.downloadButton}
                  disabled={status === 'downloading'}
                >
                  <Text style={styles.downloadButtonText}>Download</Text>
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
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Models</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
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
  closeButtonText: {
    color: colors.tint,
    fontSize: 14,
    fontFamily: typography.primary.medium,
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
  },
  deleteButtonText: {
    color: colors.error,
    fontFamily: typography.primary.medium,
    fontSize: 12,
  },
})
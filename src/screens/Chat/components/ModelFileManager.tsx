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
}

export const ModelFileManager: React.FC<ModelFileManagerProps> = ({ 
  visible, 
  onClose,
  onDownloadModel
}) => {
  const [modelFiles, setModelFiles] = useState<ModelFile[]>([])
  const downloader = new ModelDownloader()
  const { selectedModelKey, modelPath, status } = useModelStore()

  const loadModelFiles = async () => {
    try {
      // Ensure directory exists
      await downloader.ensureDirectory()
      
      const files = await ReactNativeBlobUtil.fs.ls(downloader.cacheDir)
      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const path = `${downloader.cacheDir}/${filename}`
          const stats = await ReactNativeBlobUtil.fs.stat(path)
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(1)
          
          // Find which model this file belongs to
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

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All Models?",
      "This will delete all downloaded model files. You'll need to download them again to use them.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
          style: "destructive",
          onPress: async () => {
            try {
              await downloader.cleanDirectory()
              await loadModelFiles() // Refresh list
            } catch (error) {
              console.error('Failed to delete model files:', error)
              Alert.alert('Error', 'Failed to delete model files')
            }
          }
        }
      ]
    )
  }

  // Load files when modal becomes visible
  useEffect(() => {
    if (visible) {
      loadModelFiles()
    }
  }, [visible])

  const isModelDownloaded = (modelKey: string) => {
    return modelFiles.some(file => file.modelKey === modelKey)
  }

  const isModelActive = (modelKey: string) => {
    return modelKey === selectedModelKey && status === 'ready'
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
          <View style={styles.container}>
            {/* Available Models Section */}
            <View style={styles.section}>
              {Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
                const downloaded = isModelDownloaded(key)
                const active = isModelActive(key)
                
                return (
                  <View key={key} style={styles.modelItem}>
                    <View style={styles.modelInfo}>
                      <Text style={styles.modelName}>
                        {model.displayName}
                        {active && <Text style={styles.activeIndicator}> ✓</Text>}
                      </Text>
                      <Text style={styles.modelSize}>
                        {key === '1B' ? '~1GB' : '~2GB'}
                      </Text>
                    </View>
                    {downloaded ? (
                      <View style={styles.downloadedBadge}>
                        <Text style={styles.downloadedText}>Downloaded</Text>
                      </View>
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

            {/* Delete All Button */}
            {modelFiles.length > 0 && (
              <TouchableOpacity
                onPress={handleDeleteAll}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete All Model Files</Text>
              </TouchableOpacity>
            )}
          </View>
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
    fontSize: 18,
    fontFamily: typography.primary.medium,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: colors.tint,
    fontSize: 16,
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
    fontFamily: typography.primary.normal,
    fontSize: 16,
  },
  activeIndicator: {
    color: colors.tint,
    fontFamily: typography.primary.medium,
  },
  modelSize: {
    color: colors.textDim,
    fontFamily: typography.primary.normal,
    fontSize: 12,
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: colors.tint,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  downloadButtonText: {
    color: colors.background,
    fontFamily: typography.primary.medium,
    fontSize: 14,
  },
  downloadedBadge: {
    backgroundColor: colors.palette.neutral300,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  downloadedText: {
    color: colors.textDim,
    fontFamily: typography.primary.medium,
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: colors.errorBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontFamily: typography.primary.medium,
    fontSize: 14,
  },
})
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, SafeAreaView } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { typography } from '@/theme'
import { colors } from '@/theme/colors'
import { ModelDownloader } from '@/utils/ModelDownloader'

interface ModelFile {
  name: string
  size: string
  path: string
}

interface ModelFileManagerProps {
  visible: boolean
  onClose: () => void
}

export const ModelFileManager: React.FC<ModelFileManagerProps> = ({ visible, onClose }) => {
  const [modelFiles, setModelFiles] = useState<ModelFile[]>([])
  const downloader = new ModelDownloader()

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
          return {
            name: filename,
            size: `${sizeMB} MB`,
            path
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
            <Text style={styles.headerTitle}>Model Files</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.container}>
            {modelFiles.length > 0 ? (
              <>
                <View style={styles.fileList}>
                  {modelFiles.map((file, index) => (
                    <View key={file.path} style={[
                      styles.fileItem,
                      index < modelFiles.length - 1 && styles.fileItemBorder
                    ]}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <Text style={styles.fileSize}>{file.size}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleDeleteAll}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete All Model Files</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.emptyText}>No model files found</Text>
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
  fileList: {
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  fileItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fileName: {
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 14,
  },
  fileSize: {
    color: colors.textDim,
    fontFamily: typography.primary.normal,
    fontSize: 14,
  },
  emptyText: {
    color: colors.textDim,
    fontFamily: typography.primary.normal,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
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
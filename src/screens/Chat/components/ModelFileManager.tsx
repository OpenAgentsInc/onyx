import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { typography } from '@/theme'
import { colors } from '@/theme/colors'
import { ModelDownloader } from '@/utils/ModelDownloader'

interface ModelFile {
  name: string
  size: string
  path: string
}

export const ModelFileManager = () => {
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

  // Load files on mount and when directory changes
  useEffect(() => {
    loadModelFiles()
  }, [])

  return (
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
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.palette.neutral200,
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
import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { typography } from '@/theme'
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
      <Text style={styles.title}>Model Files</Text>
      
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

          <Pressable 
            onPress={handleDeleteAll}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed
            ]}
          >
            <Text style={styles.deleteButtonText}>Delete All Model Files</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.emptyText}>No model files found</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.medium,
    color: '#fff',
    marginBottom: 16,
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
    borderBottomColor: '#333',
  },
  fileName: {
    color: '#fff',
    fontFamily: typography.primary.normal,
    fontSize: 14,
  },
  fileSize: {
    color: '#888',
    fontFamily: typography.primary.normal,
    fontSize: 14,
  },
  emptyText: {
    color: '#888',
    fontFamily: typography.primary.normal,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: typography.primary.medium,
    fontSize: 16,
  },
})
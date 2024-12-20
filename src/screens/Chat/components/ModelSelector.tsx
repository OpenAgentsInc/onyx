import React from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { typography } from '@/theme'
import { AVAILABLE_MODELS } from '../constants'
import { useModelStore } from '@/store/useModelStore'

export const ModelSelector = () => {
  const { selectedModelKey, selectModel, startDownload, status, progress } = useModelStore()

  const handleModelSelect = async (key: string) => {
    console.log('Model button pressed:', key, 'Current status:', status)
    if (status === 'downloading' || status === 'initializing') return

    if (key !== selectedModelKey) {
      console.log('Selecting new model:', key)
      selectModel(key)
    }
    
    if (status === 'idle') {
      console.log('Starting download for model:', key)
      startDownload()
    }
  }

  const getButtonText = (key: string, model: any) => {
    if (key === selectedModelKey) {
      switch (status) {
        case 'downloading':
          return `Downloading ${model.displayName}... ${progress}%`
        case 'initializing':
          return `Initializing ${model.displayName}...`
        case 'idle':
          return `Download ${model.displayName}`
        default:
          return model.displayName
      }
    }
    return model.displayName
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Model</Text>
      {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
        <Pressable
          key={key}
          onPress={() => handleModelSelect(key)}
          disabled={status === 'downloading' || status === 'initializing'}
          style={[
            styles.modelButton,
            key === selectedModelKey && styles.selectedButton,
            (status === 'downloading' || status === 'initializing') && styles.disabledButton
          ]}
        >
          <Text style={styles.modelText}>
            {getButtonText(key, model)}
          </Text>
          {key === selectedModelKey && status === 'idle' && (
            <Text style={styles.downloadText}>Click to download</Text>
          )}
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: typography.primary.normal,
    marginBottom: 20,
    textAlign: 'center',
  },
  modelButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#444',
    borderColor: '#666',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  modelText: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.normal,
    textAlign: 'center',
  },
  downloadText: {
    color: '#888',
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 4,
  },
})
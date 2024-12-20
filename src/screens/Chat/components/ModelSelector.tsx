import React from 'react'
import { Pressable, Text, View, StyleSheet, ScrollView } from 'react-native'
import { typography } from '@/theme'
import { AVAILABLE_MODELS } from '../constants'
import { useModelStore } from '@/store/useModelStore'
import { ModelFileManager } from './ModelFileManager'

export const ModelSelector = () => {
  const { selectedModelKey, selectModel, status } = useModelStore()

  const handleModelSelect = (key: string) => {
    console.log('Model selected:', key)
    selectModel(key)
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Model to Download</Text>
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
              {model.displayName}
            </Text>
            <Text style={styles.sizeText}>
              {key === '1B' ? '~1GB' : '~2GB'}
            </Text>
          </Pressable>
        ))}

        {/* Model File Manager */}
        <View style={styles.managerContainer}>
          <ModelFileManager />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
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
  sizeText: {
    color: '#888',
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 4,
  },
  managerContainer: {
    marginTop: 20,
  },
})
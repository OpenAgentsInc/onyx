import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { typography } from '@/theme'
import { AVAILABLE_MODELS } from '../constants'
import { useModelStore } from '@/store/useModelStore'
import Button from '@/components/Button'

export const ModelSelector = () => {
  const { selectedModelKey, selectModel, status } = useModelStore()

  const handleModelSelect = (key: string) => {
    console.log('Model selected:', key)
    selectModel(key)
  }

  return (
    <View style={styles.container}>
      {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
        <View key={key} style={styles.modelItem}>
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>
              {model.displayName}
            </Text>
            <Text style={styles.modelSize}>
              {key === '1B' ? '~1GB' : '~2GB'}
            </Text>
          </View>
          <Button
            onPress={() => handleModelSelect(key)}
            isDisabled={status === 'downloading' || status === 'initializing'}
            theme={key === selectedModelKey ? 'PRIMARY' : 'SECONDARY'}
            style={styles.selectButton}
          >
            {key === selectedModelKey ? 'Selected' : 'Select'}
          </Button>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modelInfo: {
    flex: 1,
    marginRight: 16,
  },
  modelName: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.normal,
  },
  modelSize: {
    color: '#888',
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 4,
  },
  selectButton: {
    width: 100,
  },
})
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { typography } from '@/theme'
import { colors } from '@/theme/colors'
import { AVAILABLE_MODELS } from '../constants'
import { useModelStore } from '@/store/useModelStore'

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
          <TouchableOpacity
            onPress={() => handleModelSelect(key)}
            disabled={status === 'downloading' || status === 'initializing'}
            style={[
              styles.selectButton,
              key === selectedModelKey && styles.selectedButton,
              (status === 'downloading' || status === 'initializing') && styles.disabledButton
            ]}
          >
            <Text style={[
              styles.selectButtonText,
              key === selectedModelKey && styles.selectedButtonText
            ]}>
              {key === selectedModelKey ? 'Selected' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.palette.neutral200,
    padding: 16,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontFamily: typography.primary.normal,
  },
  modelSize: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: typography.primary.normal,
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedButton: {
    backgroundColor: colors.palette.primary500,
    borderColor: colors.palette.primary500,
  },
  disabledButton: {
    opacity: 0.5,
  },
  selectButtonText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  selectedButtonText: {
    color: colors.background,
  },
})
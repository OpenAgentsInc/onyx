import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { typography } from '@/theme'
import { AVAILABLE_MODELS } from '../constants'
import { useModelStore } from '@/store/useModelStore'

export const ModelSelector = () => {
  const { selectedModelKey, selectModel } = useModelStore()

  return (
    <View style={{ padding: 10, backgroundColor: '#000' }}>
      {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
        <Pressable
          key={key}
          onPress={() => selectModel(key)}
          style={{
            backgroundColor: selectedModelKey === key ? '#666' : '#444',
            padding: 10,
            borderRadius: 5,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: typography.primary.normal }}>
            {model.displayName}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
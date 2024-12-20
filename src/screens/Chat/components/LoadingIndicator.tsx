import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { typography } from '@/theme'

export const LoadingIndicator = () => (
  <View style={{ padding: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color="white" />
    <Text style={{ color: 'white', fontFamily: typography.primary.normal, marginTop: 10 }}>
      Checking model...
    </Text>
  </View>
)
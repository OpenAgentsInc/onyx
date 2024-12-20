import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { typography } from '@/theme'

export const LoadingIndicator = () => (
  <View style={{ 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <ActivityIndicator color="white" size="large" />
    <Text style={{ 
      color: 'white', 
      fontFamily: typography.primary.normal, 
      marginTop: 10,
      fontSize: 16,
    }}>
      Checking model...
    </Text>
  </View>
)
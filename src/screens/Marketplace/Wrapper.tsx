import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useNostr } from '@/services/hooks/useNostr'
import Screen from './Screen'

const $container: ViewStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#000',
  width: '100vw',
  height: '100vh'
}

export default function MarketplaceWrapper() {
  const { npub, isLoading, error } = useNostr()
  
  return (
    <View style={$container}>
      <Screen 
        npub={npub}
        isLoading={isLoading}
        error={error}
      />
    </View>
  )
}
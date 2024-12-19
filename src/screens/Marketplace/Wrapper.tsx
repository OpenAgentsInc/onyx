import React from 'react'
import { useNostr } from '@/services/hooks/useNostr'
import Screen from './Screen'

export default function MarketplaceWrapper() {
  const { npub, isLoading, error } = useNostr()
  
  return (
    <Screen 
      npub={npub}
      isLoading={isLoading}
      error={error}
    />
  )
}
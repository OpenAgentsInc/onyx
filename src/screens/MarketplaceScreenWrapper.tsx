import React from 'react'
import { useNostr } from '@/services/hooks/useNostr'
import MarketplaceScreen from './MarketplaceScreen'

export default function MarketplaceScreenWrapper() {
  const { npub, isLoading, error } = useNostr()
  
  return (
    <MarketplaceScreen 
      npub={npub}
      isLoading={isLoading}
      error={error}
    />
  )
}
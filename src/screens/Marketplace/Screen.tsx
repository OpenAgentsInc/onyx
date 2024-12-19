'use dom'

import React from 'react'
import { Text, TextStyle, View } from 'react-native'
import Card from '@/components/Card'

interface MarketplaceScreenProps {
  npub: string | null
  isLoading: boolean
  error: string | null
}

export default function MarketplaceScreen({
  npub,
  isLoading,
  error
}: MarketplaceScreenProps) {
  return (
    <div className="marketplace">
      <Card title="Marketplace">
        <Text style={$text}>
          Welcome to the Onyx Marketplace
        </Text>
      </Card>

      <View style={$footer}>
        {isLoading ? (
          <Text style={$nostrKey}>Loading Nostr key...</Text>
        ) : error ? (
          <Text style={$nostrKey}>Error loading Nostr key: {error}</Text>
        ) : npub ? (
          <Text style={$nostrKey}>Nostr: {npub}</Text>
        ) : null}
      </View>
    </div>
  )
}

const $text: TextStyle = {
  fontSize: 14,
  lineHeight: 1.5,
  color: '#fff',
  fontFamily: 'jetBrainsMonoRegular, monospace',
}

const $footer = {
  marginTop: 'auto',
  paddingTop: 20,
  borderTop: '1px solid #333',
}

const $nostrKey = {
  fontSize: 12,
  color: '#666',
  fontFamily: 'jetBrainsMonoRegular, monospace',
  wordBreak: 'break-all' as const,
}
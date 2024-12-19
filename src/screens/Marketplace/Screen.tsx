'use dom'

import React from 'react'
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
        <div style={$text}>
          Welcome to the Onyx Marketplace
        </div>
      </Card>

      <div style={$footer}>
        {isLoading ? (
          <div style={$nostrKey}>Loading Nostr key...</div>
        ) : error ? (
          <div style={$nostrKey}>Error loading Nostr key: {error}</div>
        ) : npub ? (
          <div style={$nostrKey}>Nostr: {npub}</div>
        ) : null}
      </div>
    </div>
  )
}

const $text = {
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
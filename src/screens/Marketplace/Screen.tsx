'use dom'

import React from "react"
import Card from "@/components/Card"
import DVMServices from "./DVMServices"

interface MarketplaceScreenProps {
  npub: string | null
  isLoading: boolean
  error: string | null
  dvmManager: any // DVMManager type
}

export default function MarketplaceScreen({
  npub,
  isLoading,
  error,
  dvmManager
}: MarketplaceScreenProps) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={$container}>
        <Card title="Marketplace">
          <div style={$text}>
            Welcome to the Onyx Marketplace
          </div>
        </Card>

        <div style={{ marginTop: 24 }}>
          <DVMServices dvmManager={dvmManager} />
        </div>

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
    </div>
  )
}

const $container = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100%',
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
'use dom'

import React from "react"
import Card from "@/components/Card"

interface DVMService {
  id: string
  title: string
  description: string
  pubkey: string
  created_at: number
}

interface MarketplaceScreenProps {
  npub: string | null
  isLoading: boolean
  error: string | null
  services: DVMService[]
}

export default function MarketplaceScreen({
  npub,
  isLoading,
  error,
  services
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
          <Card title="DVM Services">
            <div style={$servicesContainer}>
              {services.length === 0 ? (
                <div style={$text}>Searching for DVM services...</div>
              ) : (
                services.map(service => (
                  <div key={service.id} style={$serviceCard}>
                    <div style={$serviceTitle}>{service.title}</div>
                    <div style={$serviceDescription}>{service.description}</div>
                    <div style={$serviceMeta}>
                      ID: {service.id.slice(0, 8)}...
                      <br />
                      Pubkey: {service.pubkey.slice(0, 8)}...
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
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

const $servicesContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
  padding: '8px 0',
}

const $serviceCard = {
  padding: 16,
  backgroundColor: '#1a1a1a',
  borderRadius: 8,
  border: '1px solid #333',
}

const $serviceTitle = {
  fontSize: 16,
  fontWeight: 'bold' as const,
  color: '#fff',
  marginBottom: 8,
  fontFamily: 'jetBrainsMonoRegular, monospace',
}

const $serviceDescription = {
  fontSize: 14,
  color: '#ccc',
  marginBottom: 12,
  fontFamily: 'jetBrainsMonoRegular, monospace',
}

const $serviceMeta = {
  fontSize: 12,
  color: '#666',
  fontFamily: 'jetBrainsMonoRegular, monospace',
}
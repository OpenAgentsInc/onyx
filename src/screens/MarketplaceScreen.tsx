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
  const styles = {
    container: {
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    text: {
      fontSize: 14,
      lineHeight: 1.5,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
    } as TextStyle,
    footer: {
      marginTop: 'auto',
      paddingTop: 20,
      borderTop: '1px solid #333',
    },
    nostrKey: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      wordBreak: 'break-all' as const,
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Marketplace">
        <Text style={styles.text}>
          Welcome to the Onyx Marketplace
        </Text>
      </Card>

      <View style={styles.footer}>
        {isLoading ? (
          <Text style={styles.nostrKey}>Loading Nostr key...</Text>
        ) : error ? (
          <Text style={styles.nostrKey}>Error loading Nostr key: {error}</Text>
        ) : npub ? (
          <Text style={styles.nostrKey}>Nostr: {npub}</Text>
        ) : null}
      </View>
    </div>
  )
}
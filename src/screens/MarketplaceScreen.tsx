'use dom'

import React from 'react'
import { Text, TextStyle } from 'react-native'
import Card from '@/components/Card'

export default function MarketplaceScreen() {
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
    } as TextStyle
  }

  return (
    <div style={styles.container}>
      <Card title="Marketplace">
        <Text style={styles.text}>
          Welcome to the Onyx Marketplace
        </Text>
      </Card>
    </div>
  )
}
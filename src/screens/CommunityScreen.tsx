'use dom'

import React from 'react'
import { Text, TextStyle } from 'react-native'
import Card from '@/components/Card'

export default function CommunityScreen() {
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
      <Card title="Community">
        <Text style={styles.text}>
          Community Hub
        </Text>
      </Card>
    </div>
  )
}
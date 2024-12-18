'use dom';

import React from "react"
import { View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Card from "@/components/Card"

export default function Onboarding2() {
  const navigation = useNavigation()

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
      minHeight: 500,
      maxWidth: 800,
      marginHorizontal: 'auto',
    },
    text: {
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      fontSize: '14px',
      lineHeight: '1.5',
    },
  }

  return (
    <View style={styles.container}>
      <Card title="Voice Commands">
        <p style={styles.text}>
          Here's how to use Onyx's voice commands...
        </p>
        <button 
          onClick={() => navigation.navigate('Onboarding3' as never)}
          style={{
            backgroundColor: '#007AFF',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px',
            fontFamily: 'jetBrainsMonoRegular, monospace',
          }}
        >
          Next
        </button>
      </Card>
    </View>
  )
}
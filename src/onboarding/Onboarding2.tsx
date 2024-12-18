'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding2() {
  const navigate = useRouterStore(state => state.navigate);

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
      marginBottom: 24,
    } as TextStyle,
    example: {
      fontSize: 16,
      color: '#4CAF50',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      padding: 16,
      backgroundColor: 'rgba(26, 26, 26, 0.8)',
      borderRadius: 8,
      marginTop: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#333',
    } as TextStyle,
    cardContent: {
      padding: 24,
      backgroundColor: '#111',
      borderRadius: 12,
      marginBottom: 24,
    },
    buttonContainer: {
      marginTop: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Voice Commands">
        <View style={styles.cardContent}>
          <Text style={styles.text}>
            You speak, Onyx listens and responds.
          </Text>
          
          <Text style={styles.example}>
            "Tell me about recent drone sightings in Colorado."
          </Text>
          
          <Text style={styles.text}>
            Your voice is automatically transcribed and integrated into the chat interface.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding1')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding3')}
            >
              Next
            </Button>
          </View>
        </View>
      </Card>
    </div>
  );
}
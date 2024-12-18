'use dom'

import * as React from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"
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
      padding: 20,
      maxWidth: 800,
      margin: '0 auto',
    },
    text: {
      fontSize: 14,
      lineHeight: 24,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 24,
    } as TextStyle,
    example: {
      fontSize: 16,
      lineHeight: 24,
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
    } as ViewStyle,
    buttonContainer: {
      marginTop: 32,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      gap: 16,
    } as ViewStyle
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
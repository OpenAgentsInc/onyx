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
      marginBottom: 12,
    } as TextStyle,
    example: {
      fontSize: 16,
      color: '#4CAF50',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      padding: '12px',
      backgroundColor: '#1A1A1A',
      borderRadius: '4px',
      marginVertical: 16,
    } as TextStyle,
    buttonContainer: {
      marginTop: '20px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Voice Commands">
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
      </Card>
    </div>
  );
}
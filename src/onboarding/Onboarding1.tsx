'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding1() {
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
    description: {
      fontSize: 16,
      lineHeight: 1.6,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 20,
    } as TextStyle,
    buttonContainer: {
      marginTop: '20px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Welcome to Onyx">
        <Text style={styles.description}>
          Onyx is your voice-driven AI agent that can find and process information from a decentralized network.
        </Text>
        <Text style={styles.text}>
          No coding needed - just speak your commands and Onyx will handle the rest.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            theme="PRIMARY"
            onClick={() => navigate('Onboarding2')}
          >
            Next
          </Button>
        </View>
      </Card>
    </div>
  );
}
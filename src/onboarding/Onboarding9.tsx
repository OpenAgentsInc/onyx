'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding9() {
  const navigate = useRouterStore(state => state.navigate);
  const [isRecording, setIsRecording] = React.useState(false);

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
      lineHeight: 24,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 24,
      display: 'block',
    } as TextStyle,
    prompt: {
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
      display: 'block',
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
    },
    recordButton: {
      marginTop: 24,
      marginBottom: 24,
      padding: 16,
      backgroundColor: isRecording ? '#ff4444' : '#4CAF50',
      borderRadius: 8,
      alignItems: 'center',
      cursor: 'pointer',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Try a Command">
        <View style={styles.cardContent}>
          <Text style={styles.text}>
            Try a voice command now!
          </Text>
          
          <Text style={styles.prompt}>
            Ask: "What drone data is available for January 2024 in Denver?"
          </Text>
          
          <View style={styles.recordButton} onClick={() => setIsRecording(!isRecording)}>
            <Text style={styles.text}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding8')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding10')}
            >
              {isRecording ? 'Please stop recording first' : 'Skip'}
            </Button>
          </View>
        </View>
      </Card>
    </div>
  );
}
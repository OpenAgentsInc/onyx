'use dom'

import * as React from "react"
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
      fontSize: '14px',
      lineHeight: '24px',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: '24px',
      display: 'block',
    },
    example: {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#4CAF50',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      padding: '16px',
      backgroundColor: 'rgba(26, 26, 26, 0.8)',
      borderRadius: '8px',
      marginTop: '24px',
      marginBottom: '24px',
      border: '1px solid #333',
      display: 'block',
    },
    cardContent: {
      padding: '24px',
      backgroundColor: '#111',
      borderRadius: '12px',
      marginBottom: '24px',
    },
    buttonContainer: {
      marginTop: '32px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '16px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Voice Commands">
        <div style={styles.cardContent}>
          <p style={styles.text}>
            You speak, Onyx listens and responds.
          </p>
          
          <p style={styles.example}>
            "Tell me about recent drone sightings in Colorado."
          </p>
          
          <p style={styles.text}>
            Your voice is automatically transcribed and integrated into the chat interface.
          </p>
          
          <div style={styles.buttonContainer}>
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
          </div>
        </div>
      </Card>
    </div>
  );
}
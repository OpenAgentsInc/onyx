'use dom'

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { CSSProperties } from "react"

export default function Onboarding1() {
  const navigate = useRouterStore(state => state.navigate);

  const styles: Record<string, CSSProperties> = {
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
    description: {
      fontSize: '16px',
      lineHeight: '24px',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: '20px',
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
      flexDirection: 'row' as const,
      justifyContent: 'flex-end',
      gap: '16px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Welcome to Onyx">
        <div style={styles.cardContent}>
          <p style={styles.description}>
            Onyx is your voice-driven AI agent that can find and process information from a decentralized network.
          </p>
          <p style={styles.text}>
            No coding needed - just speak your commands and Onyx will handle the rest.
          </p>
          <div style={styles.buttonContainer}>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding2')}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
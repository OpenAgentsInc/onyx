'use dom'

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { CSSProperties } from "react"

export default function Onboarding7() {
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
    highlight: {
      fontSize: '14px',
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
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      gap: '16px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Privacy & Security">
        <div style={styles.cardContent}>
          <p style={styles.text}>
            Your data is yours. Onyx only shares what you approve.
          </p>
          
          <p style={styles.highlight}>
            We use NIP-42 for authentication, end-to-end encryption for events, and never upload voice data without your consent.
          </p>
          
          <p style={styles.text}>
            You're in control of your privacy settings at all times.
          </p>
          
          <div style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding6')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding8')}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
'use dom'

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { CSSProperties } from "react"

export default function Onboarding3() {
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
    orbContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '24px 0',
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
      <Card title="Meet the Onyx Orb">
        <div style={styles.cardContent}>
          <p style={styles.text}>
            This orb represents Onyx. When it pulses, it's thinking!
          </p>
          
          <div style={styles.orbContainer}>
            {/* TODO: Add Onyx orb image/animation */}
          </div>
          
          <p style={styles.text}>
            Tap the orb to reveal more details or trigger certain actions.
          </p>
          
          <div style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding2')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding4')}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
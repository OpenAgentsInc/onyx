'use dom'

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { CSSProperties } from "react"

export default function Onboarding9() {
  const navigate = useRouterStore(state => state.navigate);
  const [isRecording, setIsRecording] = React.useState(false);

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
    prompt: {
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
    recordButton: {
      marginTop: '24px',
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: isRecording ? '#ff4444' : '#4CAF50',
      borderRadius: '8px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      fontSize: '14px',
      border: 'none',
      width: '100%',
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
      <Card title="Try a Command">
        <div style={styles.cardContent}>
          <p style={styles.text}>
            Try a voice command now!
          </p>
          
          <p style={styles.prompt}>
            Ask: "What drone data is available for January 2024 in Denver?"
          </p>
          
          <button 
            style={styles.recordButton}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          <div style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding8')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding10')}
              disabled={isRecording}
            >
              {isRecording ? 'Please stop recording first' : 'Skip'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
'use dom'

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { CSSProperties } from "react"

export default function Onboarding10() {
  const navigate = useRouterStore(state => state.navigate);
  const setOnboarded = useOnboardingStore(state => state.setOnboarded);

  const handleComplete = () => {
    setOnboarded();
    navigate('Marketplace');
  };

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
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      gap: '16px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Ready to Explore">
        <div style={styles.cardContent}>
          <p style={styles.text}>
            You're ready! Open the tabs at the bottom to explore Marketplace, Analysis, Community, and Feedback.
          </p>
          
          <p style={styles.highlight}>
            Speak freely. Onyx will handle the rest!
          </p>
          
          <div style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding9')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={handleComplete}
            >
              Get Started
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
'use dom';

import * as React from "react"
import Card from "@/components/Card"
import Button from "@/components/Button"
import { useRouterStore } from "@/store/useRouterStore"
import { useOnboardingStore } from "@/store/useOnboardingStore"

export default function Onboarding3() {
  const navigate = useRouterStore(state => state.navigate)
  const setOnboarded = useOnboardingStore(state => state.setOnboarded)

  const handleComplete = () => {
    setOnboarded()
    navigate('Marketplace')
  }

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
      lineHeight: '1.5',
    },
    buttonContainer: {
      marginTop: '20px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Ready to Start">
        <p style={styles.text}>
          You're all set! Let's get started.
        </p>
        <div style={styles.buttonContainer}>
          <Button 
            theme="PRIMARY"
            onClick={handleComplete}
          >
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  )
}
'use dom';

import * as React from "react"
import { useNavigation } from "@react-navigation/native"
import Card from "@/components/Card"
import Button from "@/components/Button"

export default function Onboarding2() {
  const navigation = useNavigation()

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
      <Card title="Voice Commands">
        <p style={styles.text}>
          Here's how to use Onyx's voice commands...
        </p>
        <div style={styles.buttonContainer}>
          <Button 
            theme="PRIMARY"
            onClick={() => navigation.navigate('Onboarding3' as never)}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}
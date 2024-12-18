'use dom';

import * as React from "react"
import { useNavigation } from "@react-navigation/native"
import Card from "@/components/Card"
import Button from "@/components/Button"

export default function Onboarding1() {
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
      <Card title="Welcome to Onyx">
        <p style={styles.text}>
          Welcome to Onyx! Let's get started with a brief intro.
        </p>
        <div style={styles.buttonContainer}>
          <Button 
            theme="PRIMARY"
            onClick={() => navigation.navigate('Onboarding2' as never)}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}
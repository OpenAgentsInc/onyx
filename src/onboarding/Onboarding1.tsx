'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding1() {
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
      fontSize: 14,
      lineHeight: 1.5,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
    } as TextStyle,
    buttonContainer: {
      marginTop: '20px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Welcome to Onyx">
        <Text style={styles.text}>
          Welcome to Onyx! Let's get started with a brief intro.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            theme="PRIMARY"
            onClick={() => navigate('Onboarding2')}
          >
            Next
          </Button>
        </View>
      </Card>
    </div>
  );
}

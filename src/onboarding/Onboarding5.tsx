'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding5() {
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
      marginBottom: 12,
    } as TextStyle,
    highlight: {
      fontSize: 14,
      color: '#4CAF50',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 12,
    } as TextStyle,
    buttonContainer: {
      marginTop: '20px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Community Intelligence">
        <Text style={styles.text}>
          Community members submit data about drone sightings. The more data submitted, the smarter Onyx becomes.
        </Text>
        <Text style={styles.highlight}>
          All reports are verified and include trust signals to ensure quality.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            theme="SECONDARY"
            onClick={() => navigate('Onboarding4')}
          >
            Back
          </Button>
          <Button
            theme="PRIMARY"
            onClick={() => navigate('Onboarding6')}
          >
            Next
          </Button>
        </View>
      </Card>
    </div>
  );
}
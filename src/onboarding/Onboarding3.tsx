'use dom'

import * as React from "react"
import { Text, TextStyle, View, Image } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding3() {
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
    orbContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 24,
    },
    buttonContainer: {
      marginTop: '20px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Meet the Onyx Orb">
        <Text style={styles.text}>
          This orb represents Onyx. When it pulses, it's thinking!
        </Text>
        <View style={styles.orbContainer}>
          {/* TODO: Add Onyx orb image/animation */}
        </View>
        <Text style={styles.text}>
          Tap the orb to reveal more details or trigger certain actions.
        </Text>
        <View style={styles.buttonContainer}>
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
        </View>
      </Card>
    </div>
  );
}
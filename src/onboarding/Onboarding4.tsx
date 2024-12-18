'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding4() {
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
      <Card title="Data Marketplace">
        <Text style={styles.text}>
          Onyx uses a data marketplace to find and pay for specialized AI services or datasets.
        </Text>
        <Text style={styles.highlight}>
          MCP connects us to tools & data sources; DVM is a marketplace of AI services.
        </Text>
        <Text style={styles.text}>
          You can post requests and receive results from different providers in the network.
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            theme="SECONDARY"
            onClick={() => navigate('Onboarding3')}
          >
            Back
          </Button>
          <Button
            theme="PRIMARY"
            onClick={() => navigate('Onboarding5')}
          >
            Next
          </Button>
        </View>
      </Card>
    </div>
  );
}
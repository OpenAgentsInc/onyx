'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding8() {
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
      lineHeight: 24,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 24,
      display: 'block',
    } as TextStyle,
    settingExample: {
      fontSize: 14,
      lineHeight: 24,
      color: '#4CAF50',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      padding: 16,
      backgroundColor: 'rgba(26, 26, 26, 0.8)',
      borderRadius: 8,
      marginTop: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#333',
      display: 'block',
    } as TextStyle,
    cardContent: {
      padding: 24,
      backgroundColor: '#111',
      borderRadius: 12,
      marginBottom: 24,
    },
    buttonContainer: {
      marginTop: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Adjusting Preferences">
        <View style={styles.cardContent}>
          <Text style={styles.text}>
            Customize your experience: choose data formats, filter community reports, manage tool permissions.
          </Text>
          
          <Text style={styles.settingExample}>
            Settings examples:
            • Data format: JSON/Text/Voice
            • Community filters: Verified only
            • Tool permissions: Custom access
          </Text>
          
          <Text style={styles.text}>
            You can change these settings anytime from your profile.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              theme="SECONDARY"
              onClick={() => navigate('Onboarding7')}
            >
              Back
            </Button>
            <Button
              theme="PRIMARY"
              onClick={() => navigate('Onboarding9')}
            >
              Next
            </Button>
          </View>
        </View>
      </Card>
    </div>
  );
}
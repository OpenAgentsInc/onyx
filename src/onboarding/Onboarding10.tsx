'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { useOnboardingStore } from "@/store/useOnboardingStore"

export default function Onboarding10() {
  const navigate = useRouterStore(state => state.navigate);
  const setOnboarded = useOnboardingStore(state => state.setOnboarded);

  const handleComplete = () => {
    setOnboarded();
    navigate('Marketplace');
  };

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
    highlight: {
      fontSize: 16,
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
      <Card title="Ready to Explore">
        <View style={styles.cardContent}>
          <Text style={styles.text}>
            You're ready! Open the tabs at the bottom to explore Marketplace, Analysis, Community, and Feedback.
          </Text>
          
          <Text style={styles.highlight}>
            Speak freely. Onyx will handle the rest!
          </Text>
          
          <View style={styles.buttonContainer}>
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
          </View>
        </View>
      </Card>
    </div>
  );
}
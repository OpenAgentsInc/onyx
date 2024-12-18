'use dom';

import React from "react"
import { View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Card from "@/components/Card"
import { useOnboardingStore } from "@/store/useOnboardingStore"

export default function Onboarding3() {
  const navigation = useNavigation()
  const setOnboarded = useOnboardingStore(state => state.setOnboarded)

  const handleComplete = () => {
    setOnboarded()
    navigation.navigate('Marketplace' as never)
  }

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
      minHeight: 500,
      maxWidth: 800,
      marginHorizontal: 'auto',
    },
    text: {
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      fontSize: '14px',
      lineHeight: '1.5',
    },
  }

  return (
    <View style={styles.container}>
      <Card title="Ready to Start">
        <p style={styles.text}>
          You're all set! Let's get started.
        </p>
        <button 
          onClick={handleComplete}
          style={{
            backgroundColor: '#007AFF',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px',
            fontFamily: 'jetBrainsMonoRegular, monospace',
          }}
        >
          Get Started
        </button>
      </Card>
    </View>
  )
}
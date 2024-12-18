'use client';
'use dom';

import * as React from "react"
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function TabIndexScreen() {
  useEffect(() => {
    // Redirect to marketplace screen
    router.replace('/(tabs)/marketplace');
  }, []);

  const styles = {
    container: {
      backgroundColor: '#000',
      flex: 1,
    },
  };

  // Return a black screen while redirecting
  return <View style={styles.container} />;
}
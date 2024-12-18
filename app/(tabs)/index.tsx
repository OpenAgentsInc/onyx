'use dom';

import * as React from "react"
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
      minHeight: '100vh',
    },
  };

  // Return a black screen while redirecting
  return <div style={styles.container} />;
}
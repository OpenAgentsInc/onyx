import * as React from "react"
import { router } from 'expo-router';
import { View } from 'react-native';

export default function TabIndexScreen() {
  React.useEffect(() => {
    // Redirect to marketplace screen
    router.replace('/(tabs)/marketplace');
  }, []);

  // Return a black screen while redirecting
  return (
    <View style={{
      backgroundColor: '#000',
      flex: 1,
    }} />
  );
}
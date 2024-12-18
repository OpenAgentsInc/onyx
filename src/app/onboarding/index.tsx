import { router } from "expo-router"
import * as React from "react"
import { View } from 'react-native'

export default function TabIndexScreen() {
  React.useEffect(() => {
    // Redirect to first onboarding screen
    router.replace('/onboarding/Onboarding1');
  }, []);

  // Return a black screen while redirecting
  return (
    <View style={{
      backgroundColor: '#000',
      flex: 1,
    }} />
  );
}
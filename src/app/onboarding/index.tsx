import { router } from "expo-router"
import * as React from "react"

export default function TabIndexScreen() {
  React.useEffect(() => {
    // Redirect to first onboarding screen
    router.replace('/onboarding/Onboarding1');
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
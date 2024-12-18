'use client';

import AppLoading from "expo-app-loading" // Make sure to install expo-app-loading
import { useFonts } from "expo-font"
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAutoUpdate } from "@/lib/useAutoUpdate" // Optional, from previous setup
import { customFontsToLoad } from "@/theme/typography"

export default function RootLayout() {
  // Load fonts using customFontsToLoad
  const [fontsLoaded] = useFonts(customFontsToLoad);

  useAutoUpdate(); // Optional

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#000',
            borderTopWidth: 0, // Remove top border
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontFamily: 'jetBrainsMonoRegular',
            fontSize: 12,
          },
          // Add these to style the navigation container
          contentStyle: {
            backgroundColor: '#000',
          },
          // Style the header (even though it's hidden, this prevents any white flash)
          headerStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        <Tabs.Screen name="tabs/marketplace" options={{ title: 'Marketplace' }} />
        <Tabs.Screen name="tabs/analysis" options={{ title: 'Analysis' }} />
        <Tabs.Screen name="tabs/community" options={{ title: 'Community' }} />
        <Tabs.Screen name="tabs/feedback" options={{ title: 'Feedback' }} />
      </Tabs>
    </>
  );
}
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { customFontsToLoad } from "@/theme/typography"
import { DarkTheme, ThemeProvider } from "@react-navigation/native"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts(customFontsToLoad);
  const isOnboarded = useOnboardingStore(state => state.isOnboarded)
  console.log("Root layout - isOnboarded:", isOnboarded)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#000',
          },
        }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        {/* {isOnboarded ? (
          // User is onboarded -> show main tabs directly
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          // User not onboarded -> show onboarding stack
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        )} */}
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

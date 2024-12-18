import { useFonts } from "expo-font"
import { Slot, useRouter, useSegments } from "expo-router"
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
  const segments = useSegments();
  const router = useRouter();
  const isOnboarded = useOnboardingStore(state => state.isOnboarded)
  console.log("Root layout - isOnboarded:", isOnboarded)
  console.log("Current segments:", segments)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isOnboarded && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    } else if (isOnboarded && segments[0] !== '(tabs)') {
      router.replace('/(tabs)');
    }
  }, [isOnboarded, segments]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
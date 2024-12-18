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
  
  useEffect(() => {
    if (!loaded) return;
    
    const inAuthGroup = segments[0] === 'onboarding';
    console.log("Root layout - isOnboarded:", isOnboarded, "inAuthGroup:", inAuthGroup);

    if (!isOnboarded && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (isOnboarded && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [loaded, segments]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <Slot />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
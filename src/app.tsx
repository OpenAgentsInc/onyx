import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { View } from "react-native"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { customFontsToLoad } from "@/theme/typography"
import { DarkTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Placeholder components - replace with actual screens
const MarketplaceScreen = () => <View />
const AnalysisScreen = () => <View />
const CommunityScreen = () => <View />
const FeedbackScreen = () => <View />
const Onboarding1Screen = () => <View />
const Onboarding2Screen = () => <View />
const Onboarding3Screen = () => <View />

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#fff",
      }}
    >
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Feedback" component={FeedbackScreen} />
    </Tab.Navigator>
  )
}

function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [loaded] = useFonts(customFontsToLoad)
  const isOnboarded = useOnboardingStore((state) => state.isOnboarded)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) return null

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  )
}
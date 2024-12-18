import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { customFontsToLoad } from "@/theme/typography"
import { DarkTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { registerRootComponent } from 'expo'
import { useNavigation } from "@react-navigation/native"

// Import screens
import Onboarding1Screen from "./onboarding/Onboarding1"
import Onboarding2Screen from "./onboarding/Onboarding2"
import Onboarding3Screen from "./onboarding/Onboarding3"
import MarketplaceScreen from "./screens/MarketplaceScreen"
import AnalysisScreen from "./screens/AnalysisScreen"
import CommunityScreen from "./screens/CommunityScreen"
import FeedbackScreen from "./screens/FeedbackScreen"

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Update onboarding screens to use navigation prop instead of expo-router
const OnboardingOne = () => {
  const navigation = useNavigation()
  return (
    <Onboarding1Screen onNext={() => navigation.navigate('Onboarding2')} />
  )
}

const OnboardingTwo = () => {
  const navigation = useNavigation()
  return (
    <Onboarding2Screen onNext={() => navigation.navigate('Onboarding3')} />
  )
}

const OnboardingThree = () => {
  const navigation = useNavigation()
  const setOnboarded = useOnboardingStore(state => state.setOnboarded)
  
  const finishOnboarding = () => {
    setOnboarded()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    })
  }

  return (
    <Onboarding3Screen onFinish={finishOnboarding} />
  )
}

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
      <Stack.Screen name="Onboarding1" component={OnboardingOne} />
      <Stack.Screen name="Onboarding2" component={OnboardingTwo} />
      <Stack.Screen name="Onboarding3" component={OnboardingThree} />
    </Stack.Navigator>
  )
}

function App() {
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

export default registerRootComponent(App);
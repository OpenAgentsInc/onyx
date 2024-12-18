import { Stack } from "expo-router"

export default function OnboardingLayout() {
  console.log("OnboardingLayout")
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="Onboarding1" options={{ title: 'Welcome' }} />
      <Stack.Screen name="Onboarding2" options={{ title: 'Intro' }} />
      <Stack.Screen name="Onboarding3" options={{ title: 'Finish' }} />
    </Stack>
  )
}
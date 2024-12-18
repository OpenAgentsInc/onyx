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
      <Stack.Screen name="Onboarding1Screen" options={{ title: 'Welcome' }} />
      <Stack.Screen name="Onboarding2Screen" options={{ title: 'Intro' }} />
      <Stack.Screen name="Onboarding3Screen" options={{ title: 'Finish' }} />
    </Stack>
  )
}

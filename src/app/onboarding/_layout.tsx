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
      <Stack.Screen name="FirstOnboardingScreen" options={{ title: 'Welcome' }} />
      <Stack.Screen name="SecondOnboardingScreen" options={{ title: 'Intro' }} />
      <Stack.Screen name="LastOnboardingScreen" options={{ title: 'Finish' }} />
    </Stack>
  )
}

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useOnboardingStore } from "@/store/useOnboardingStore"
import { OnboardingNavigator } from "./OnboardingNavigator"
import { TabNavigator } from "./TabNavigator"

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  const isOnboarded = useOnboardingStore((state) => state.isOnboarded)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboarded ? (
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingNavigator}
          options={{
            gestureEnabled: false
          }}
        />
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  )
}
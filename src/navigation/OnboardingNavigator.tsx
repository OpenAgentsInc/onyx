import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Onboarding1Screen from "../onboarding/Onboarding1"
import Onboarding2Screen from "../onboarding/Onboarding2"
import Onboarding3Screen from "../onboarding/Onboarding3"

const Stack = createNativeStackNavigator()

export function OnboardingNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen 
        name="Onboarding3" 
        component={Onboarding3Screen}
        listeners={{
          beforeRemove: (e) => {
            if (e.data.action.type === 'GO_BACK') {
              e.preventDefault()
            }
          }
        }}
      />
    </Stack.Navigator>
  )
}
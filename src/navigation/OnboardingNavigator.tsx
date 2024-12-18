import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Onboarding1Screen from "../onboarding/Onboarding1"
import Onboarding2Screen from "../onboarding/Onboarding2"
import Onboarding3Screen from "../onboarding/Onboarding3"
import Onboarding4Screen from "../onboarding/Onboarding4"
import Onboarding5Screen from "../onboarding/Onboarding5"
import Onboarding6Screen from "../onboarding/Onboarding6"

const Stack = createNativeStackNavigator()

export function OnboardingNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="Onboarding1"
    >
      <Stack.Screen 
        name="Onboarding1" 
        component={Onboarding1Screen}
      />
      <Stack.Screen 
        name="Onboarding2" 
        component={Onboarding2Screen}
      />
      <Stack.Screen 
        name="Onboarding3" 
        component={Onboarding3Screen}
      />
      <Stack.Screen 
        name="Onboarding4" 
        component={Onboarding4Screen}
      />
      <Stack.Screen 
        name="Onboarding5" 
        component={Onboarding5Screen}
      />
      <Stack.Screen 
        name="Onboarding6" 
        component={Onboarding6Screen}
        listeners={{
          beforeRemove: (e) => {
            // Only prevent back gesture/button on final screen
            if (e.data.action.type === 'GO_BACK') {
              e.preventDefault()
            }
          }
        }}
      />
    </Stack.Navigator>
  )
}
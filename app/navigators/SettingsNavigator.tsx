import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SettingsScreen } from "@/screens/SettingsScreen/SettingsScreen"
import { AutocoderSettings } from "@/screens/SettingsScreen/AutocoderSettings"

export type SettingsStackParamList = {
  SettingsMenu: undefined
  AutocoderSettings: undefined
}

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SettingsMenu"
    >
      <Stack.Screen name="SettingsMenu" component={SettingsScreen} />
      <Stack.Screen name="AutocoderSettings" component={AutocoderSettings} />
    </Stack.Navigator>
  )
}
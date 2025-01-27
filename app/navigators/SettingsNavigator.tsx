import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SettingsScreen } from "@/screens/SettingsScreen/SettingsScreen"
import { AutocoderSettings } from "@/screens/SettingsScreen/AutocoderSettings"
import { ShareScreen } from "@/screens/ShareScreen/ShareScreen"
import { NotificationsScreen } from "@/screens/SettingsScreen/NotificationsScreen"

export type SettingsStackParamList = {
  SettingsMenu: undefined
  AutocoderSettings: undefined
  ShareScreen: undefined
  NotificationsScreen: undefined
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
      <Stack.Screen name="ShareScreen" component={ShareScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Stack.Navigator>
  )
}
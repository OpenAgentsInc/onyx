import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { MainTabScreenProps } from "./MainNavigator"
import { ProfileScreen } from "@/screens/ProfileScreen"
import { UpdaterScreen } from "@/screens/UpdaterScreen"

export type ProfileMenuParamList = {
  ProfileHome: undefined
  Updater: undefined
}

export type ProfileMenuScreenProps<T extends keyof ProfileMenuParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileMenuParamList, T>,
  MainTabScreenProps<"Profile">
>

const Stack = createNativeStackNavigator<ProfileMenuParamList>()

export function ProfileMenuNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ProfileHome"
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Updater" component={UpdaterScreen} />
    </Stack.Navigator>
  )
}
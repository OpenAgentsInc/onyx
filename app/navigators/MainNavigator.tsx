import { ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CustomTabBar } from "@/components/CustomTabBar"
import { useAppTheme } from "@/utils/useAppTheme"
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import {
  CommunityScreen,
  HomeScreen,
  OnyxScreen,
  WalletScreen,
} from "../screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ProfileMenuNavigator } from "./ProfileMenuNavigator"

import type { ThemedStyle } from "@/theme"

export type MainTabParamList = {
  Home: undefined
  Community: undefined
  Onyx: undefined
  Wallet: undefined
  Profile: undefined
}

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: false,
      }}
      initialRouteName="Onyx"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
      />

      <Tab.Screen
        name="Onyx"
        component={OnyxScreen}
        options={{
          lazy: false,
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileMenuNavigator}
      />
    </Tab.Navigator>
  )
}
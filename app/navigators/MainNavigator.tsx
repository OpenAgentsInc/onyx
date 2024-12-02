import { ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppTheme } from "@/utils/useAppTheme"
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { Icon } from "../components"
import {
  HomeScreen,
  CommunityScreen,
  OnyxScreen,
  WalletScreen,
  ProfileScreen,
} from "../screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

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
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 50 }]),
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarShowLabel: false,
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="groups" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="Onyx"
        component={OnyxScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="mic" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="account-balance-wallet" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="person" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.separator,
  paddingVertical: 8,
})

const $tabBarItem: ThemedStyle<ViewStyle> = () => ({
  padding: 0,
})
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppTheme } from "@/utils/useAppTheme"
import {
  BottomTabScreenProps, createBottomTabNavigator
} from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { Icon } from "../components"
import { translate } from "../i18n"
import {
  DemoCommunityScreen, DemoDebugScreen, DemoShowroomScreen, OnyxScreen
} from "../screens"
import { DemoPodcastListScreen } from "../screens/DemoPodcastListScreen"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

import type { ThemedStyle } from "@/theme"
export type MainTabParamList = {
  Onyx: undefined
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
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
        name="Onyx"
        component={OnyxScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="people" color={focused ? colors.tint : colors.tintInactive} size={28} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon icon="bug-report" color={focused ? colors.tint : colors.tintInactive} size={28} />
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
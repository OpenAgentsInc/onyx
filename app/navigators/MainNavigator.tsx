import { Image, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Header, Text } from "@/components"
import { CustomTabBar } from "@/components/CustomTabBar"
import { useAppTheme } from "@/utils/useAppTheme"
import {
  BottomTabScreenProps, createBottomTabNavigator
} from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import {
  CommunityScreen, HomeScreen, MarketplaceScreen, NotificationsScreen,
  OnyxScreen, WalletScreen
} from "../screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ProfileMenuNavigator } from "./ProfileMenuNavigator"

import type { ThemedStyle } from "@/theme"

export type MainTabParamList = {
  Home: undefined
  // Community: undefined
  Onyx: undefined
  Notifications: undefined
  Marketplace: undefined
  // Wallet: undefined
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
        headerShown: true,
        header: ({ route, navigation }) => (
          <Header
            titleMode="center"
            backgroundColor="black"
            title={
              <Image
                source={require('../../assets/images/app-icon-all.png')}
                resizeMode="contain"
                style={{ width: 100, height: 30 }} // adjust size as needed
              />
            }
            containerStyle={{
              borderBottomColor: '#1a1a1a',
              borderBottomWidth: 1
            }}
          />
        ),
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
        name="Marketplace"
        component={MarketplaceScreen}
      />

      <Tab.Screen
        name="Onyx"
        component={OnyxScreen}
        options={{
          lazy: false,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
      />

      {/* <Tab.Screen
        name="Wallet"
        component={WalletScreen}
      /> */}

      <Tab.Screen
        name="Profile"
        component={ProfileMenuNavigator}
      />
    </Tab.Navigator>
  )
}

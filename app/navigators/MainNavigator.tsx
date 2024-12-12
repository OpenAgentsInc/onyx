import { useMemo } from "react"
import { Image, TouchableOpacity, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Header, Text } from "@/components"
import { CustomTabBar } from "@/components/CustomTabBar"
import Money from "@/components/MoneySmall"
import { useStores } from "@/models"
import { colorsDark } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import {
  BottomTabScreenProps, createBottomTabNavigator
} from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import {
  CommunityScreen, HomeScreen, InboxScreen, MarketplaceScreen,
  NotificationsScreen, OnyxScreen, WalletScreen
} from "../screens"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ProfileMenuNavigator } from "./ProfileMenuNavigator"

export type MainTabParamList = {
  Home: undefined
  Marketplace: undefined
  Onyx: undefined
  Notifications: undefined
  Inbox: undefined
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
  const { walletStore } = useStores()
  const {
    balanceSat,
    pendingSendSat,
    pendingReceiveSat,
    isInitialized,
    error,
    fetchBalanceInfo
  } = walletStore


  const totalBalance = useMemo(() => balanceSat + pendingSendSat + pendingReceiveSat,
    [balanceSat, pendingSendSat, pendingReceiveSat])

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
                style={{ width: 100, height: 36 }}
              />
            }
            containerStyle={{
              borderBottomColor: colorsDark.border,
              borderBottomWidth: 1
            }}
            LeftActionComponent={
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={{ uri: 'https://pbs.twimg.com/profile_images/1866325943201021952/8UZH5JFx_400x400.jpg' }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginLeft: 16  // Add some padding from the left edge
                  }}
                />
              </TouchableOpacity>
            }

            RightActionComponent={
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Wallet')}>
                <Money sats={totalBalance} symbol={true} />
              </TouchableOpacity>
            }
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

      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
      />
    </Tab.Navigator>
  )
}

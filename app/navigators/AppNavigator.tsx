import { observer } from "mobx-react-lite"
import { ComponentProps } from "react"
import * as Screens from "@/screens"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { SettingsNavigator } from "./SettingsNavigator"

export type AppStackParamList = {
  Chat: undefined
  Settings: undefined
  Wallet: undefined
  Profile: undefined
  Send: undefined
  Receive: undefined
  BackupWallet: undefined
  RestoreWallet: undefined
}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={"Chat"}
    >
      <Stack.Screen name="Chat" component={Screens.ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsNavigator} />
      <Stack.Screen name="Profile" component={Screens.ProfileScreen} />
      <Stack.Screen name="Wallet" component={Screens.WalletScreen} />
      <Stack.Screen name="Send" component={Screens.SendScreen} />
      <Stack.Screen name="Receive" component={Screens.ReceiveScreen} />
      <Stack.Screen name="BackupWallet" component={Screens.BackupWalletScreen} />
      <Stack.Screen name="RestoreWallet" component={Screens.RestoreWalletScreen} />
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider("dark")

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      {/* @ts-ignore */}
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  )
})
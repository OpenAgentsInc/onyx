import { observer } from "mobx-react-lite"
import { ComponentProps } from "react"
import * as Screens from "@/screens"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigatorScreenParams,
  ParamListBase,
} from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import Config from "../config"
import { useStores } from "../models"
import { MainNavigator, MainTabParamList } from "./MainNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

export type AppStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>
  Login: undefined
  Welcome: undefined
  Chat: undefined
}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

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
      initialRouteName="Main"
    >
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Login" component={Screens.LoginScreen} />
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      <Stack.Screen name="Chat" component={Screens.ChatScreen} />
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> { }

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer
        ref={(ref) => {
          if (ref) {
            (navigationRef as any).current = ref;
          }
        }}
        theme={navigationTheme}
        {...props}
      >
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  )
})
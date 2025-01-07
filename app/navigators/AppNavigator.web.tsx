import { observer } from "mobx-react-lite"
import { ComponentProps } from "react"
import { ChatDemo } from "@/osint/ChatDemo"
import { Test as OSINTDemo } from "@/osint/Test"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

export type AppStackParamList = {
  ChatDemo: undefined
  OSINT: undefined
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
      initialRouteName={"ChatDemo"}
    >
      <Stack.Screen name="ChatDemo" component={ChatDemo} />
      <Stack.Screen name="OSINT" component={OSINTDemo} />
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

import { observer } from "mobx-react-lite";
import { ComponentProps } from "react";
import * as Screens from "@/screens";
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Config from "../config";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";
import { SettingsNavigator } from "./SettingsNavigator";
import { WalletNavigator } from "./WalletNavigator";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AuthCallback } from '../screens/AuthCallback';
import { LoginScreen } from '../screens/LoginScreen';

export type AppStackParamList = {
  Chat: undefined;
  Settings: undefined;
  Wallet: undefined;
  Profile: undefined;
  Login: undefined;
  AuthCallback: { code?: string };
};

const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  const {
    theme: { colors },
  } = useAppTheme();
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "Chat" : "Login"}
    >
      {isAuthenticated ? (
        // Authenticated stack
        <>
          <Stack.Screen name="Chat" component={Screens.ChatScreen} />
          <Stack.Screen name="Settings" component={SettingsNavigator} />
          <Stack.Screen name="Profile" component={Screens.ProfileScreen} />
          <Stack.Screen name="Wallet" component={WalletNavigator} />
        </>
      ) : (
        // Auth stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AuthCallback" component={AuthCallback} />
        </>
      )}
    </Stack.Navigator>
  );
});

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider("dark");

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <AuthProvider>
        <NavigationContainer 
          ref={navigationRef} 
          theme={navigationTheme} 
          {...props}
          linking={{
            prefixes: ['onyx://', 'https://onyx.openagents.com'],
            config: {
              screens: {
                AuthCallback: 'auth/github/callback',
                Login: 'login',
                Chat: 'chat',
                Settings: 'settings',
                Profile: 'profile',
                Wallet: 'wallet',
              },
            },
          }}
        >
          <AppStack />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
});
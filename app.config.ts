import { ConfigContext, ExpoConfig } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  return {
    ...config,
    plugins: [
      ...existingPlugins,
      'expo-localization',
      'expo-sqlite',
      'expo-notifications',
    ],
    extra: {
      ...config.extra,
      BREEZ_API_KEY: process.env.BREEZ_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
    android: {
      ...config.android,
      useNextNotificationsApi: true,
    },
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        UIBackgroundModes: ['remote-notification'],
      },
    },
  }
}
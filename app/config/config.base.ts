import Constants from "expo-constants"

export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  API_URL?: string
  GROQ_API_KEY?: string | null
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

console.log(Constants.expoConfig)

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: "dev",

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: "always",

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ["Welcome"],

  /**
   * The API URL for backend services
   */
  API_URL: process.env.API_URL,

  /**
   * The Groq API key for chat completions
   */
  GROQ_API_KEY: Constants.expoConfig?.extra?.GROQ_API_KEY ?? "grrr"
}

export default BaseConfig

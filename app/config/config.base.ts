import Constants from "expo-constants"

export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  API_URL?: string
  GROQ_API_KEY?: string | null
  GOOGLE_CLOUD_PROJECT: string | null
  GOOGLE_CLOUD_REGION: string | null
  GEMINI_API_KEY: string | null
  NEXUS_URL: string
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

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
  GROQ_API_KEY: Constants.expoConfig?.extra?.GROQ_API_KEY ?? "grrr",

  /**
   * Google Cloud Project ID
   */
  GOOGLE_CLOUD_PROJECT: Constants.expoConfig?.extra?.GOOGLE_CLOUD_PROJECT ?? null,

  /**
   * Google Cloud Region
   */
  GOOGLE_CLOUD_REGION: Constants.expoConfig?.extra?.GOOGLE_CLOUD_REGION ?? "us-central1",

  /**
   * Gemini API key
   */
  GEMINI_API_KEY: Constants.expoConfig?.extra?.GEMINI_API_KEY ?? null,

  /**
   * Nexus API URL
   */
  NEXUS_URL: "http://localhost:3000",
}

export default BaseConfig
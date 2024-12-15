/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig } from "./api.types"
import { Platform } from "react-native"
import * as FileSystem from "expo-file-system"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Send an audio recording to the API
   */
  async sendAudioRecording(uri: string): Promise<{ ok: boolean; data?: any; error?: string }> {
    try {
      // For demo purposes, we'll just mock the API call
      console.log("Sending audio recording:", uri)
      
      // In a real implementation, you would:
      // 1. Read the file
      // const audioData = await FileSystem.readAsStringAsync(uri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // })
      
      // 2. Send to server
      // const response = await this.apisauce.post("/audio", {
      //   audio: audioData,
      //   timestamp: new Date().toISOString(),
      // })

      // Mock successful response
      return {
        ok: true,
        data: {
          message: "Audio recording received successfully",
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error("Error sending audio recording:", error)
      return {
        ok: false,
        error: "Failed to send audio recording",
      }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
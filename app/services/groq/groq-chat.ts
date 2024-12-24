import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { log } from "@/utils/log"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import { DEFAULT_SYSTEM_MESSAGE } from "../local-models/constants"

import type { GroqConfig, ChatMessage, ChatCompletionResponse, TranscriptionResponse, TranscriptionConfig } from "./groq-api.types"
import type { IMessage } from "../../models/chat/ChatStore"

const DEFAULT_CONFIG: GroqConfig = {
  apiKey: Config.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
}

/**
 * Manages chat interactions with the Groq API.
 */
export class GroqChatApi {
  apisauce: ApisauceInstance
  config: GroqConfig

  constructor(config: GroqConfig = DEFAULT_CONFIG) {
    this.config = config

    log({
      name: 'we have groq api key',
      preview: config.apiKey
    })

    this.apisauce = create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
    })
  }

  /**
   * Converts ChatStore messages to Groq API format
   */
  private convertToGroqMessages(messages: IMessage[]): ChatMessage[] {
    // Add system message if not present
    if (!messages.find(msg => msg.role === "system")) {
      messages = [DEFAULT_SYSTEM_MESSAGE, ...messages]
    }
    return messages.map(msg => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content
    }))
  }

  /**
   * Creates a chat completion with the Groq API
   */
  async createChatCompletion(
    messages: IMessage[],
    model: string = "llama3-70b-8192",
    options: {
      temperature?: number
      max_tokens?: number
      top_p?: number
      stop?: string | string[]
      response_format?: { type: "json_object" }
    } = {},
  ): Promise<{ kind: "ok"; response: ChatCompletionResponse } | GeneralApiProblem> {
    try {
      const groqMessages = this.convertToGroqMessages(messages)

      const response: ApiResponse<ChatCompletionResponse> = await this.apisauce.post(
        "/chat/completions",
        {
          messages: groqMessages,
          model,
          ...options,
        },
      )

      log({
        name: "[GroqChatApi] createChatCompletion",
        preview: "Chat completion response",
        value: response.data,
        important: true,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      if (!response.data) throw new Error("No data received from Groq API")

      return { kind: "ok", response: response.data }
    } catch (e) {
      if (__DEV__) {
        log.error("[GroqChatApi]", e instanceof Error ? e.message : "Unknown error")
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Transcribes audio using the Groq API
   */
  async transcribeAudio(
    audioUri: string,
    config: Partial<TranscriptionConfig> = {}
  ): Promise<{ kind: "ok"; response: TranscriptionResponse } | GeneralApiProblem> {
    try {
      // Create form data
      const formData = new FormData()

      // Get the file extension from the URI
      const extension = audioUri.split('.').pop()?.toLowerCase() || 'm4a'
      const mimeType = `audio/${extension === 'm4a' ? 'mp4' : extension}`

      // Create file object from URI
      formData.append('file', {
        uri: audioUri,
        type: mimeType,
        name: `audio.${extension}`,
      } as any)

      // Add other configuration
      formData.append("model", config.model || "whisper-large-v3")
      if (config.language) formData.append("language", config.language)
      if (config.prompt) formData.append("prompt", config.prompt)
      if (config.response_format) formData.append("response_format", config.response_format)
      if (config.temperature !== undefined) formData.append("temperature", config.temperature.toString())
      if (config.timestamp_granularities) {
        config.timestamp_granularities.forEach(granularity => {
          formData.append("timestamp_granularities[]", granularity)
        })
      }

      log({
        name: "[GroqChatApi] transcribeAudio",
        preview: "Sending transcription request",
        value: {
          uri: audioUri,
          mimeType,
          formData: Object.fromEntries(formData as any),
        },
        important: true,
      })

      // Create a new instance with multipart/form-data
      const formDataApi = create({
        baseURL: this.config.baseURL,
        timeout: this.config.timeout,
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })

      const response: ApiResponse<TranscriptionResponse> = await formDataApi.post(
        "/audio/transcriptions",
        formData
      )

      log({
        name: "[GroqChatApi] transcribeAudio",
        preview: "Transcription response",
        value: {
          status: response.status,
          data: response.data,
          problem: response.problem,
          originalError: response.originalError,
        },
        important: true,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      if (!response.data) throw new Error("No data received from Groq API")

      return { kind: "ok", response: response.data }
    } catch (e) {
      if (__DEV__) {
        log.error("[GroqChatApi]", e instanceof Error ? e.message : "Unknown error")
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const groqChatApi = new GroqChatApi()
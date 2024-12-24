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
      const systemMessage: IMessage = {
        id: "system",
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE.content,
        createdAt: Date.now(),
        metadata: {},
      }
      messages = [systemMessage, ...messages]
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
        log.error("[GroqChatApi] " + (e instanceof Error ? e.message : "Unknown error"))
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
      log({
        name: "[GroqChatApi] transcribeAudio",
        preview: "Audio file path",
        value: audioUri,
        important: true,
      })

      // Create form data
      const formData = new FormData()

      // Create file object from uri
      const fileInfo = {
        uri: audioUri,
        type: "audio/m4a",
        name: "recording.m4a"
      }

      // Add file to form data
      formData.append("file", fileInfo as any)
      formData.append("model", config.model || "whisper-large-v3")
      if (config.language) formData.append("language", config.language)

      // Log the form data
      log({
        name: "[GroqChatApi] transcribeAudio",
        preview: "Form data",
        value: {
          file: fileInfo,
          model: config.model || "whisper-large-v3",
          language: config.language,
        },
        important: true,
      })

      // Make the request using fetch
      const response = await fetch(`${this.config.baseURL}/audio/transcriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          Accept: "application/json",
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        log({
          name: "[GroqChatApi] transcribeAudio",
          preview: "Server error response",
          value: errorText,
          important: true,
        })
        return { kind: "bad-data" }
      }

      const data = await response.json()
      return { kind: "ok", response: data }
    } catch (e) {
      log({
        name: "[GroqChatApi] transcribeAudio error",
        preview: "Error",
        value: e instanceof Error ? e.message : String(e),
        important: true,
      })
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const groqChatApi = new GroqChatApi()
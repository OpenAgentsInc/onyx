import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { log } from "@/utils/log"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"

import type { GroqConfig, ChatMessage, ChatCompletionResponse } from "./groq-api.types"
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
    model: string = "llama-3.2-3b-preview",
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
}

// Singleton instance of the API for convenience
export const groqChatApi = new GroqChatApi()

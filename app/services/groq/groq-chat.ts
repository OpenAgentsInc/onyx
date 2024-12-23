import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import type { GroqConfig, ChatMessage, ChatCompletionResponse, ChatCompletionStreamResponse } from "./groq-api.types"
import type { IMessage } from "../../models/chat/ChatStore"
import { log } from "@/utils/log"

const DEFAULT_CONFIG: GroqConfig = {
  apiKey: Config.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/v1",
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
      role: msg.role,
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
      stream?: boolean
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

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      if (!response.data) throw new Error("No data received from Groq API")

      return { kind: "ok", response: response.data }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        log.error(`[GroqChatApi] Error: ${e.message}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Creates a streaming chat completion with the Groq API
   */
  async *createStreamingChatCompletion(
    messages: IMessage[],
    model: string = "llama3-70b-8192",
    options: {
      temperature?: number
      max_tokens?: number
      top_p?: number
      stop?: string | string[]
    } = {},
  ): AsyncGenerator<ChatCompletionStreamResponse | GeneralApiProblem, void, unknown> {
    try {
      const groqMessages = this.convertToGroqMessages(messages)
      
      const response = await this.apisauce.post(
        "/chat/completions",
        {
          messages: groqMessages,
          model,
          stream: true,
          ...options,
        },
        { responseType: "stream" },
      )

      if (!response.ok || !response.data) {
        const problem = getGeneralApiProblem(response)
        if (problem) yield problem
        return
      }

      const reader = response.data.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") return
              try {
                const parsed: ChatCompletionStreamResponse = JSON.parse(data)
                yield parsed
              } catch (e) {
                if (__DEV__) {
                  log.error("[GroqChatApi] Failed to parse SSE data:", e)
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        log.error(`[GroqChatApi] Streaming Error: ${e.message}`, e.stack)
      }
      yield { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const groqChatApi = new GroqChatApi()
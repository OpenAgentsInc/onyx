import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"

import type {
  GroqConfig,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionStreamResponse,
  ChatMessage,
} from "./groq-api.types"

const DEFAULT_CONFIG: GroqConfig = {
  apiKey: Config.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
}

/**
 * Manages all requests to the Groq API.
 */
export class GroqApi {
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
   * Creates a chat completion with the Groq API
   */
  async createChatCompletion(
    messages: ChatMessage[],
    model: string = "llama3-70b-8192",
    options: Partial<ChatCompletionRequest> = {},
  ): Promise<{ kind: "ok"; response: ChatCompletionResponse } | GeneralApiProblem> {
    const request: ChatCompletionRequest = {
      messages,
      model,
      ...options,
    }

    const response: ApiResponse<ChatCompletionResponse> = await this.apisauce.post(
      "/chat/completions",
      request,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const data = response.data
      if (!data) throw new Error("No data received from Groq API")

      return { kind: "ok", response: data }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Creates a streaming chat completion with the Groq API
   */
  async *createStreamingChatCompletion(
    messages: ChatMessage[],
    model: string = "llama3-70b-8192",
    options: Partial<ChatCompletionRequest> = {},
  ): AsyncGenerator<ChatCompletionStreamResponse, void, unknown> {
    const request: ChatCompletionRequest = {
      messages,
      model,
      stream: true,
      ...options,
    }

    const response = await this.apisauce.post("/chat/completions", request, {
      responseType: "stream",
    })

    if (!response.ok || !response.data) {
      throw new Error("Failed to create streaming chat completion")
    }

    // Handle SSE stream
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
              console.error("Failed to parse SSE data:", e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}

// Singleton instance of the API for convenience
export const groqApi = new GroqApi()

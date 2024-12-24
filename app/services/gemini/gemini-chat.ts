import { ApiResponse, ApisauceInstance, create } from "apisauce"
import { log } from "@/utils/log"
import Config from "../../config"
import { MessageModel } from "../../models/chat/ChatStore"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import { DEFAULT_SYSTEM_MESSAGE } from "../local-models/constants"
import { ITool } from "../../models/tools/ToolStore"

import type { GeminiConfig, ChatMessage, ChatCompletionResponse, GenerateContentConfig, FunctionDeclaration } from "./gemini-api.types"
import type { IMessage } from "../../models/chat/ChatStore"

const DEFAULT_CONFIG: GeminiConfig = {
  apiKey: Config.GEMINI_API_KEY ?? "",
  baseURL: "https://generativelanguage.googleapis.com/v1",
  timeout: 30000,
}

/**
 * Manages chat interactions with the Gemini API.
 */
export class GeminiChatApi {
  apisauce: ApisauceInstance
  config: GeminiConfig

  constructor(config: GeminiConfig = DEFAULT_CONFIG) {
    this.config = config

    this.apisauce = create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  /**
   * Converts a tool to a Gemini function declaration
   */
  private convertToolToFunctionDeclaration(tool: ITool): FunctionDeclaration {
    return {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties: Object.entries(tool.parameters).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: {
            type: value as string,
            description: `Parameter ${key} for ${tool.name}`,
            required: true
          }
        }), {}),
        required: Object.keys(tool.parameters)
      }
    }
  }

  /**
   * Converts ChatStore messages to Gemini API format
   */
  private convertToGeminiMessages(messages: IMessage[]): ChatMessage[] {
    // Add system message if not present
    if (!messages.find(msg => msg.role === "system")) {
      const systemMessage = MessageModel.create({
        id: "system",
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE.content,
        createdAt: Date.now(),
        metadata: {},
      })
      messages = [systemMessage, ...messages]
    }

    // Filter out any messages with empty content and ensure content is a string
    return messages
      .filter(msg => msg.content && msg.content.trim() !== "")
      .map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content.trim(),
        function_call: msg.metadata?.function_call,
      }))
  }

  /**
   * Creates a chat completion with the Gemini API
   */
  async createChatCompletion(
    messages: IMessage[],
    options: GenerateContentConfig = {},
  ): Promise<{ kind: "ok"; response: ChatCompletionResponse } | GeneralApiProblem> {
    try {
      const geminiMessages = this.convertToGeminiMessages(messages)

      // Validate that we have at least one message with non-empty content
      if (geminiMessages.length === 0) {
        throw new Error("No valid messages to send to Gemini API")
      }

      // Convert tools to function declarations if provided
      const functionDeclarations = options.tools?.map(tool => 
        this.convertToolToFunctionDeclaration(tool)
      )

      const payload = {
        contents: [{
          parts: geminiMessages.map(msg => ({
            text: msg.content
          }))
        }],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxOutputTokens ?? 1024,
          topP: options.topP ?? 0.8,
          topK: options.topK ?? 10,
        },
        tools: functionDeclarations ? {
          function_declarations: functionDeclarations
        } : undefined,
        tool_config: options.tool_config
      }

      const response: ApiResponse<any> = await this.apisauce.post(
        `/models/gemini-1.5-flash:generateContent?key=${this.config.apiKey}`,
        payload
      )

      log({
        name: "[GeminiChatApi] createChatCompletion",
        preview: "Chat completion response",
        value: { request: payload, response: response.data },
        important: true,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      if (!response.data) throw new Error("No data received from Gemini API")

      // Handle function calls in response
      const functionCall = response.data.candidates[0].content.parts[0].function_call
      const content = functionCall 
        ? JSON.stringify(functionCall)
        : response.data.candidates[0].content.parts[0].text

      // Convert Gemini response to Groq format for consistency
      const formattedResponse: ChatCompletionResponse = {
        id: "gemini-" + Date.now(),
        object: "chat.completion",
        created: Date.now(),
        model: "gemini-1.5-flash",
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content,
          },
          finish_reason: response.data.candidates[0].finishReason,
        }],
        usage: {
          prompt_tokens: 0, // Gemini doesn't provide token counts
          completion_tokens: 0,
          total_tokens: 0,
        },
      }

      return { kind: "ok", response: formattedResponse }
    } catch (e) {
      if (__DEV__) {
        log.error("[GeminiChatApi] " + (e instanceof Error ? e.message : "Unknown error"))
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const geminiChatApi = new GeminiChatApi()
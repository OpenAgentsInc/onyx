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
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  timeout: 30000,
}

interface ExtendedChatMessage extends ChatMessage {
  name?: string;
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
    // Convert parameters to Gemini format
    const properties: Record<string, { type: string; description: string }> = {}
    for (const [key, value] of Object.entries(tool.parameters)) {
      if (typeof value === 'object' && value !== null && 'type' in value && 'description' in value) {
        properties[key] = {
          type: String(value.type),
          description: String(value.description),
        }
      }
    }

    return {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties,
        required: Object.keys(tool.parameters)
      }
    }
  }

  /**
   * Converts ChatStore messages to Gemini API format
   */
  private convertToGeminiMessages(messages: IMessage[]): ExtendedChatMessage[] {
    // For Gemini, convert system message to user message and prepend it
    const systemMessage = messages.find(msg => msg.role === "system")
    const nonSystemMessages = messages.filter(msg => msg.role !== "system")
    
    if (systemMessage) {
      nonSystemMessages.unshift({
        ...systemMessage,
        role: "user"
      })
    } else {
      // Add default system message as user message
      nonSystemMessages.unshift(MessageModel.create({
        id: "system",
        role: "user",
        content: DEFAULT_SYSTEM_MESSAGE.content,
        createdAt: Date.now(),
        metadata: {},
      }))
    }

    // Filter out any messages with empty content and ensure content is a string
    return nonSystemMessages
      .filter(msg => msg.content && msg.content.trim() !== "")
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role === "function" ? "model" : "user",
        content: msg.content.trim(),
        ...(msg.metadata?.name ? { name: msg.metadata.name } : {}),
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
        contents: geminiMessages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
          ...(msg.name && { name: msg.name }), // Include function name if present
        })),
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxOutputTokens ?? 1024,
          topP: options.topP ?? 0.8,
          topK: options.topK ?? 10,
        },
        tools: functionDeclarations ? [{
          functionDeclarations
        }] : undefined,
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }

      log({
        name: "[GeminiChatApi] createChatCompletion",
        preview: "Request payload",
        value: { payload },
        important: true,
      })

      const response: ApiResponse<any> = await this.apisauce.post(
        `/models/gemini-pro:generateContent?key=${this.config.apiKey}`,
        payload
      )

      log({
        name: "[GeminiChatApi] createChatCompletion",
        preview: "Chat completion response",
        value: { response: response.data },
        important: true,
      })

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      if (!response.data) throw new Error("No data received from Gemini API")

      // Handle function calls in response
      const functionCall = response.data.candidates?.[0]?.content?.parts?.[0]?.functionCall
      let content
      if (functionCall) {
        // Format function call to match expected structure
        content = JSON.stringify({
          functionCall: {
            name: functionCall.name,
            args: functionCall.args
          }
        })
      } else {
        content = response.data.candidates[0].content.parts[0].text
      }

      // Convert Gemini response to Groq format for consistency
      const formattedResponse: ChatCompletionResponse = {
        id: "gemini-" + Date.now(),
        object: "chat.completion",
        created: Date.now(),
        model: "gemini-pro",
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
import { log } from "@/utils/log"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import { DEFAULT_SYSTEM_MESSAGE } from "../local-models/constants"
import { IMessage } from "../../models/chat/ChatStore"

import type {
  GeminiConfig,
  ChatMessage,
  ChatCompletionResponse,
  GenerateContentConfig,
  Tool,
  ToolCall,
  ToolResponse
} from "./gemini-api.types"

const DEFAULT_CONFIG: GeminiConfig = {
  project: Config.GOOGLE_CLOUD_PROJECT ?? "",
  location: Config.GOOGLE_CLOUD_REGION ?? "us-central1",
  model: "gemini-2.0-flash-exp",
  timeout: 30000,
}

/**
 * Manages chat interactions with the Gemini API
 */
export class GeminiChatApi {
  config: GeminiConfig
  client: any // Will be initialized with Google Gen AI client

  constructor(config: GeminiConfig = DEFAULT_CONFIG) {
    this.config = config
    this.initializeClient()
  }

  private async initializeClient() {
    try {
      const { genai } = await import("@google/generative-ai")
      this.client = new genai.Client({
        project: this.config.project,
        location: this.config.location,
      })

      log({
        name: "GeminiChatApi initialized",
        preview: "Client created successfully",
        value: {
          project: this.config.project,
          location: this.config.location,
        },
      })
    } catch (error) {
      log.error("[GeminiChatApi]", "Failed to initialize client:", error)
      throw error
    }
  }

  /**
   * Converts ChatStore messages to Gemini API format
   */
  private convertToGeminiMessages(messages: IMessage[]): ChatMessage[] {
    // Add system message if not present
    if (!messages.find(msg => msg.role === "system")) {
      messages = [{
        id: "system",
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE.content,
        createdAt: Date.now(),
        metadata: {},
      } as IMessage, ...messages]
    }

    return messages.map(msg => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content,
      tools: msg.metadata?.tools,
    }))
  }

  /**
   * Handles tool calls from Gemini
   */
  private async handleToolCalls(toolCalls: ToolCall[], tools: Tool[]): Promise<ToolResponse[]> {
    const responses: ToolResponse[] = []

    for (const call of toolCalls) {
      try {
        const tool = tools.find(t => t.name === call.name)
        if (!tool) {
          throw new Error(`Tool ${call.name} not found`)
        }

        const result = await tool.execute(call.parameters)
        responses.push({
          toolCallId: call.id,
          result,
        })
      } catch (error) {
        log.error("[GeminiChatApi]", `Error executing tool ${call.name}:`, error)
        responses.push({
          toolCallId: call.id,
          result: { error: error instanceof Error ? error.message : "Unknown error" },
        })
      }
    }

    return responses
  }

  /**
   * Creates a chat completion with the Gemini API
   */
  async createChatCompletion(
    messages: IMessage[],
    config: GenerateContentConfig = {},
  ): Promise<{ kind: "ok"; response: ChatCompletionResponse } | GeneralApiProblem> {
    try {
      const geminiMessages = this.convertToGeminiMessages(messages)

      // Create chat session
      const chat = this.client.chat({
        model: this.config.model,
        temperature: config.temperature,
        maxOutputTokens: config.maxOutputTokens,
        topP: config.topP,
        topK: config.topK,
        stopSequences: config.stopSequences,
        candidateCount: config.candidateCount,
        tools: config.tools,
      })

      // Send messages
      const response = await chat.sendMessages(geminiMessages)

      // Handle tool calls if present
      if (response.candidates[0].toolCalls && config.tools) {
        const toolResponses = await this.handleToolCalls(
          response.candidates[0].toolCalls,
          config.tools
        )

        // Send tool responses back to continue the conversation
        const finalResponse = await chat.sendMessages([
          ...geminiMessages,
          {
            role: "assistant",
            content: response.candidates[0].message.content,
            tools: toolResponses,
          },
        ])

        return { kind: "ok", response: finalResponse }
      }

      return { kind: "ok", response }
    } catch (error) {
      log.error("[GeminiChatApi]", error instanceof Error ? error.message : "Unknown error")
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const geminiChatApi = new GeminiChatApi()
import { flow, Instance, getRoot } from "mobx-state-tree"
import { log } from "@/utils/log"
import { groqChatApi } from "../../services/groq/groq-chat"
import { geminiChatApi } from "../../services/gemini/gemini-chat"
import type { RootStore } from "../RootStore"
import type { ChatStore, ChatStoreModel } from "./ChatStore"
import type { ITool } from "../tools/ToolStore"

type ChatActions = {
  sendMessage: (content: string) => Promise<void>
}

/**
 * Chat actions that integrate with the Groq and Gemini APIs
 */
export const withGroqActions = (self: Instance<typeof ChatStoreModel>): ChatActions => ({
  /**
   * Sends a message to the selected model and handles the response
   */
  sendMessage: flow(function* (content: string): Generator<any, void, any> {
    try {
      // Add user message
      const userMessage = self.addMessage({
        role: "user",
        content,
        metadata: {
          conversationId: self.currentConversationId,
        },
      })

      // Add placeholder assistant message
      const assistantMessage = self.addMessage({
        role: "assistant",
        content: "",
        metadata: {
          conversationId: self.currentConversationId,
          isGenerating: true,
        },
      })

      self.setIsGenerating(true)

      let result
      if (self.activeModel === "groq") {
        // Get chat completion from Groq
        result = yield groqChatApi.createChatCompletion(
          self.currentMessages,
          "llama-3.1-8b-instant",
          {
            temperature: 0.7,
            max_tokens: 1024,
          },
        )
      } else {
        // Get enabled tools from store
        const rootStore = getRoot<RootStore>(self)
        const enabledTools: ITool[] = rootStore.toolStore.enabledTools

        // Get chat completion from Gemini
        result = yield geminiChatApi.createChatCompletion(
          self.currentMessages,
          {
            temperature: 0.7,
            maxOutputTokens: 1024,
            tools: enabledTools,
          },
        )
      }

      if (result.kind === "ok") {
        const response = result.response
        const message = response.choices[0].message
        const content = message.content

        // Try to parse content as a function call
        try {
          const functionCall = JSON.parse(content)
          if (functionCall && functionCall.name && functionCall.args) {
            log({
              name: "[ChatActions] Function Call",
              preview: "Executing function",
              value: { functionCall },
              important: true,
            })

            // Update message to show function call
            self.updateMessage(assistantMessage.id, {
              content: JSON.stringify(functionCall, null, 2),
              metadata: {
                ...assistantMessage.metadata,
                isGenerating: true,
                tokens: response.usage?.completion_tokens,
                model: self.activeModel,
              },
            })

            // Get the tool implementation
            const rootStore = getRoot<RootStore>(self)
            const toolId = `github_${functionCall.name}`
            
            log({
              name: "[ChatActions] Looking for tool",
              preview: "Getting tool",
              value: { 
                toolId, 
                tools: rootStore.toolStore.tools.map(t => ({ id: t.id, enabled: t.enabled })),
                isInitialized: rootStore.toolStore.isInitialized
              },
              important: true,
            })

            // Initialize tools if not initialized
            if (!rootStore.toolStore.isInitialized) {
              log({
                name: "[ChatActions] Tools not initialized",
                preview: "Initializing tools",
                important: true,
              })
              yield rootStore.toolStore.initializeDefaultTools()
            }

            const tool = rootStore.toolStore.getToolById(toolId)
            if (!tool) {
              throw new Error(`Tool ${functionCall.name} not found`)
            }

            log({
              name: "[ChatActions] Found tool",
              preview: "Tool details",
              value: { 
                toolId: tool.id,
                name: tool.name,
                enabled: tool.enabled,
                hasImplementation: !!tool.metadata?.implementation
              },
              important: true,
            })

            const implementation = tool.metadata?.implementation
            if (!implementation) {
              throw new Error(`Tool ${functionCall.name} implementation not found`)
            }

            // Execute the tool
            log({
              name: "[ChatActions] Executing tool",
              preview: "Running implementation",
              value: { args: functionCall.args },
              important: true,
            })
            
            const toolResult = yield implementation(functionCall.args)
            
            log({
              name: "[ChatActions] Tool result",
              preview: "Got result",
              value: { toolResult },
              important: true,
            })

            if (!toolResult.success) {
              throw new Error(toolResult.error)
            }

            // Add tool result as a function message
            self.addMessage({
              role: "function",
              content: typeof toolResult.data === 'string' 
                ? toolResult.data 
                : JSON.stringify(toolResult.data, null, 2),
              metadata: {
                conversationId: self.currentConversationId,
                name: functionCall.name,
              },
            })

            // Get analysis from the model
            const analysisResult = yield geminiChatApi.createChatCompletion(
              self.currentMessages,
              {
                temperature: 0.7,
                maxOutputTokens: 1024,
              }
            )

            if (analysisResult.kind !== "ok") {
              throw new Error("Failed to get analysis from model")
            }

            // Update message with analysis
            self.updateMessage(assistantMessage.id, {
              content: analysisResult.response.choices[0].message.content,
              metadata: {
                ...assistantMessage.metadata,
                isGenerating: false,
                tokens: analysisResult.response.usage?.completion_tokens,
                model: self.activeModel,
                toolResult: toolResult.data,
              },
            })
            return
          }
        } catch (err) {
          // Not a function call, continue with normal message handling
          log({
            name: "[ChatActions] Not a function call",
            preview: "Regular message",
            value: { content, error: err },
            important: true,
          })
        }

        // Regular message response
        self.updateMessage(assistantMessage.id, {
          content: content,
          metadata: {
            ...assistantMessage.metadata,
            isGenerating: false,
            tokens: response.usage?.completion_tokens,
            model: self.activeModel,
          },
        })
      } else {
        // Handle error
        self.updateMessage(assistantMessage.id, {
          content: "Sorry, I encountered an error while processing your message: " + JSON.stringify(result),
          metadata: {
            ...assistantMessage.metadata,
            isGenerating: false,
            error: result.kind,
            model: self.activeModel,
          },
        })
        if (__DEV__) {
          log.error("[ChatActions]", `Error sending message: ${result.kind}`)
        }
      }
    } catch (error) {
      if (__DEV__) {
        log.error("[ChatActions]", `Error in sendMessage: ${error}`)
      }
      self.setError("Failed to send message")
    } finally {
      self.setIsGenerating(false)
    }
  }),
})
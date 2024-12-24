import { flow, Instance } from "mobx-state-tree"
import { log } from "@/utils/log"
import { groqChatApi } from "../../services/groq/groq-chat"
import { geminiChatApi } from "../../services/gemini/gemini-chat"
import { getRootStore } from "../_helpers/getRootStore"

/**
 * Chat actions that integrate with the Groq and Gemini APIs
 */
export const withGroqActions = (self: Instance<any>) => ({
  /**
   * Sends a message to the selected model and handles the response
   */
  sendMessage: flow(function* (content: string) {
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
        const rootStore = getRootStore(self)
        const enabledTools = rootStore.toolStore.enabledTools

        // Get chat completion from Gemini
        result = yield geminiChatApi.createChatCompletion(
          self.currentMessages,
          {
            temperature: 0.7,
            maxOutputTokens: 1024,
            tools: enabledTools,
            tool_config: {
              function_calling_config: {
                mode: "AUTO"
              }
            }
          },
        )
      }

      if (result.kind === "ok") {
        // Update assistant message with response
        self.updateMessage(assistantMessage.id, {
          content: result.response.choices[0].message.content,
          metadata: {
            ...assistantMessage.metadata,
            isGenerating: false,
            tokens: result.response.usage?.completion_tokens,
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
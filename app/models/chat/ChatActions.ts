import { flow, Instance } from "mobx-state-tree"
import { log } from "@/utils/log"
import { groqChatApi } from "../../services/groq/groq-chat"

/**
 * Chat actions that integrate with the Groq API
 */
export const withGroqActions = (self: Instance<any>) => ({
  /**
   * Sends a message to Groq and handles the response
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

      // Get chat completion from Groq
      const result = yield groqChatApi.createChatCompletion(
        self.currentMessages,
        "llama3-70b-8192",
        {
          temperature: 0.7,
          max_tokens: 1024,
        },
      )

      if (result.kind === "ok") {
        // Update assistant message with response
        self.updateMessage(assistantMessage.id, {
          content: result.response.choices[0].message.content,
          metadata: {
            ...assistantMessage.metadata,
            isGenerating: false,
            tokens: result.response.usage.completion_tokens,
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

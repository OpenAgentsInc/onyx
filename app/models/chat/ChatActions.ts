import { flow } from "mobx-state-tree"
import { groqChatApi } from "../../services/groq/groq-chat"
import type { ChatStore } from "./ChatStore"
import { log } from "@/utils/log"

/**
 * Chat actions that integrate with the Groq API
 */
export const withGroqActions = (self: ChatStore) => ({
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
          content: "Sorry, I encountered an error while processing your message.",
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

  /**
   * Sends a message to Groq and streams the response
   */
  sendStreamingMessage: flow(function* (content: string) {
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

      // Stream chat completion from Groq
      const stream = groqChatApi.createStreamingChatCompletion(
        self.currentMessages,
        "llama3-70b-8192",
        {
          temperature: 0.7,
          max_tokens: 1024,
        },
      )

      let accumulatedContent = ""

      // Use a while loop with yield to handle streaming in a generator
      while (true) {
        const { value: chunk, done } = yield stream.next()
        if (done) break

        if ("kind" in chunk) {
          // Handle error chunk
          self.updateMessage(assistantMessage.id, {
            content: "Sorry, I encountered an error while processing your message.",
            metadata: {
              ...assistantMessage.metadata,
              isGenerating: false,
              error: chunk.kind,
            },
          })
          if (__DEV__) {
            log.error("[ChatActions]", `Error in stream: ${chunk.kind}`)
          }
          return
        }

        // Handle normal chunk
        const content = chunk.choices[0].delta.content
        if (content) {
          accumulatedContent += content
          self.updateMessage(assistantMessage.id, {
            content: accumulatedContent,
          })
        }
      }

      // Mark message as complete
      self.updateMessage(assistantMessage.id, {
        metadata: {
          ...assistantMessage.metadata,
          isGenerating: false,
        },
      })
    } catch (error) {
      if (__DEV__) {
        log.error("[ChatActions]", `Error in sendStreamingMessage: ${error}`)
      }
      self.setError("Failed to send message")
    } finally {
      self.setIsGenerating(false)
    }
  }),
})
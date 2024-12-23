import { flow } from "mobx-state-tree"
import { ILLMStore } from "../"
import { log } from "@/utils/log"
import { getRoot } from "mobx-state-tree"
import { RootStore } from "@/models"

const DEFAULT_SYSTEM_MESSAGE = {
  role: "system" as const,
  content: "This is a conversation between user and assistant, a friendly chatbot.\n\n"
}

export const withChatCompletion = (self: ILLMStore) => {
  return {
    chatCompletion: flow(function* (message: string) {
      try {
        if (!self.context || !self.isInitialized) {
          throw new Error("Context not initialized")
        }

        const root = getRoot(self) as RootStore
        const chatStore = root.chatStore

        // Add user message
        const userMsg = chatStore.addMessage({
          role: "user",
          content: message,
          metadata: {
            contextId: self.context.id,
            conversationId: chatStore.currentConversationId
          }
        })

        // Prepare messages array for completion
        const messages = [
          DEFAULT_SYSTEM_MESSAGE,
          ...chatStore.currentMessages
            .filter(msg => !msg.metadata?.system)
            .map(msg => ({
              role: msg.role,
              content: msg.content
            }))
        ]

        log.info("[LLMStore] Starting chat completion with messages:", messages)

        // Create placeholder for assistant response
        const assistantMsg = chatStore.addMessage({
          role: "assistant",
          content: "",
          metadata: {
            contextId: self.context.id,
            conversationId: chatStore.currentConversationId,
            inProgress: true
          }
        })

        // Start completion
        self.inferencing = true

        const formattedChat = yield self.context.getFormattedChat(messages)
        log.debug("[LLMStore] Formatted chat:", formattedChat)

        const result = yield self.context.completion({
          messages,
          n_predict: 400,
          temperature: 0.7,
          top_k: 40,
          top_p: 0.5,
          min_p: 0.05,
          stop: [
            "</s>",
            "<|end|>",
            "<|eot_id|>",
            "<|end_of_text|>",
            "<|im_end|>",
            "<|EOT|>",
            "<|END_OF_TURN_TOKEN|>",
            "<|end_of_turn|>",
            "<|endoftext|>"
          ]
        }, (data) => {
          // Update assistant message with new token
          const { token } = data
          assistantMsg.content = (assistantMsg.content + token).replace(/^\s+/, "")
        })

        log.info("[LLMStore] Completion result:", result)

        // Update metadata with timing info
        assistantMsg.metadata = {
          ...assistantMsg.metadata,
          inProgress: false,
          timings: {
            predictedPerTokenMs: result.timings.predicted_per_token_ms,
            predictedPerSecond: result.timings.predicted_per_second
          }
        }

        self.inferencing = false
        return result

      } catch (error) {
        log.error("[LLMStore] Chat completion error:", error)
        self.inferencing = false
        self.error = error instanceof Error ? error.message : "Chat completion failed"
        throw error
      }
    })
  }
}
import { flow } from "mobx-state-tree"
import { ILLMStore } from "../"
import { log } from "@/utils/log"
import { getRoot } from "mobx-state-tree"
import { RootStore } from "@/models"
import type { IMessage } from "@/models/chat/ChatStore"

const DEFAULT_SYSTEM_MESSAGE = {
  role: "system" as const,
  content: "This is a conversation between user and assistant, a friendly chatbot.\n\n"
}

interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

interface CompletionResult {
  text: string
  timings: {
    predicted_per_token_ms: number
    predicted_per_second: number
  }
}

export const withChatCompletion = (self: ILLMStore) => ({
  chatCompletion: flow(function* (message: string): Generator<any, CompletionResult, any> {
    try {
      if (!self.context || !self.isInitialized) {
        throw new Error("Context not initialized")
      }

      const root = getRoot<RootStore>(self)
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
      const messages: Message[] = [
        DEFAULT_SYSTEM_MESSAGE,
        ...chatStore.currentMessages
          .filter((msg: IMessage) => !msg.metadata?.system)
          .map((msg: IMessage) => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content
          }))
      ]

      log({
        name: "[LLMStore] Chat Completion",
        preview: "Starting chat completion",
        value: messages
      })

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
      log({
        name: "[LLMStore] Chat Completion",
        preview: "Formatted chat",
        value: formattedChat
      })

      let currentContent = ""
      const result: CompletionResult = yield self.context.completion({
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
        currentContent = (currentContent + token).replace(/^\s+/, "")
        chatStore.updateMessage(assistantMsg.id, { content: currentContent })
      })

      log({
        name: "[LLMStore] Chat Completion",
        preview: "Completion result",
        value: result
      })

      // Update metadata with timing info
      chatStore.updateMessage(assistantMsg.id, {
        metadata: {
          ...assistantMsg.metadata,
          inProgress: false,
          timings: {
            predictedPerTokenMs: result.timings.predicted_per_token_ms,
            predictedPerSecond: result.timings.predicted_per_second
          }
        }
      })

      self.inferencing = false
      return result

    } catch (error) {
      log({
        name: "[LLMStore] Chat Completion",
        preview: "Error",
        value: error instanceof Error ? error.message : "Unknown error",
        important: true
      })
      self.inferencing = false
      self.error = error instanceof Error ? error.message : "Chat completion failed"
      throw error
    }
  })
})
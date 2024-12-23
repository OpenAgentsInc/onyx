import { useStores } from "@/models"
import { useCallback } from "react"
import { ChatStore } from "@/models/chat/store"
import { log } from "@/utils/log"
import { systemMessage } from "@/screens/Chat/constants"

export const useChatStore = () => {
  const { chatStore } = useStores() as { chatStore: ChatStore }

  const sendMessage = useCallback(async (text: string) => {
    if (!chatStore.activeContext) {
      chatStore.setError("No active chat context")
      return
    }

    // Add user message
    const messageId = chatStore.addMessage({
      text,
      role: "user",
      metadata: {
        contextId: chatStore.activeContext.id,
        conversationId: chatStore.activeContext.id, // Using context ID as conversation ID for now
      }
    })

    // Set inferencing state
    chatStore.setInferencing(true)

    try {
      // Format conversation history
      const msgs = [
        systemMessage,
        ...chatStore.conversationMessages
          .filter(msg => !msg.metadata?.system)
          .map(msg => ({
            role: msg.role,
            content: msg.text
          }))
      ]

      // Create assistant message placeholder
      const assistantMessageId = chatStore.addMessage({
        text: "",
        role: "assistant",
        metadata: {
          contextId: chatStore.activeContext.id,
          conversationId: chatStore.activeContext.id,
        }
      })

      log({ 
        name: "[ChatStore] Starting completion",
        value: {
          messages: msgs,
          contextId: chatStore.activeContext.id
        }
      })

      // Start completion with streaming
      const completionResult = await chatStore.activeContext.completion(
        {
          messages: msgs,
          n_predict: 100,
          grammar: undefined,
          seed: -1,
          n_probs: 0,

          // Sampling params
          top_k: 40,
          top_p: 0.5,
          min_p: 0.05,
          temperature: 0.7,
          repeat_penalty: 1.1,
          
          // Stop sequences
          stop: [
            "</s>",
            "<|end|>",
            "<|eot_id|>", 
            "<|end_of_text|>",
            "<|im_end|>",
            "<|EOT|>",
            "<|END_OF_TURN_TOKEN|>",
            "<|end_of_turn|>",
            "<|endoftext|>",
          ],
        },
        (data) => {
          const { token } = data
          // Update assistant message with new token
          chatStore.updateMessage(assistantMessageId, {
            text: (chatStore.messages.find(m => m.id === assistantMessageId)?.text || "") + token
          })
        }
      )

      // Log completion result
      log({
        name: "[ChatStore] Completion result",
        value: completionResult
      })

      // Update message with timing metadata
      const timings = `${completionResult.timings.predicted_per_token_ms.toFixed()}ms per token, ${completionResult.timings.predicted_per_second.toFixed(2)} tokens per second`
      
      chatStore.updateMessage(assistantMessageId, {
        metadata: {
          ...chatStore.messages.find(m => m.id === assistantMessageId)?.metadata,
          timings
        }
      })

    } catch (error) {
      log({
        name: "[ChatStore] Completion error",
        value: {
          error,
          errorMessage: error instanceof Error ? error.message : String(error)
        },
        important: true
      })
      chatStore.setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      chatStore.setInferencing(false)
    }
  }, [chatStore])

  return {
    sendMessage,
    isInferencing: chatStore.inferencing,
    error: chatStore.error,
    conversationMessages: chatStore.conversationMessages,
  }
}
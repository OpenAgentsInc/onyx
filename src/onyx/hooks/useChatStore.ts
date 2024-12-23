import { useStores } from "@/models"
import { useCallback } from "react"
import { ChatStore } from "@/models/chat/store"

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
      // TODO: Add actual inference logic here
      // For now, just add a mock response
      await new Promise(resolve => setTimeout(resolve, 1000))
      chatStore.addMessage({
        text: `Response to: ${text}`,
        role: "assistant",
        metadata: {
          contextId: chatStore.activeContext.id,
          conversationId: chatStore.activeContext.id,
        }
      })
    } catch (error) {
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
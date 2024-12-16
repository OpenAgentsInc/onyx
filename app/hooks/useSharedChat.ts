import { runInAction } from "mobx"
import { useCallback, useEffect } from "react"
import { useStores } from "../models"
import { Message } from "../models/ChatStore"
import { useLlamaVercelChat } from "./useLlamaVercelChat"

// Create a shared hook that wraps the Llama chat functionality
export function useSharedChat() {
  const { chatStore } = useStores()
  const { append, error, isLoading, handleModelInit } = useLlamaVercelChat()

  // Wrap append to ensure correct typing and store sync
  const appendMessage = useCallback(async (message: { role: Message["role"]; content: string }) => {
    const response = await append(message)
    if (response) {
      runInAction(() => {
        chatStore.addMessage({
          id: response.id,
          role: message.role,
          content: message.content,
          createdAt: new Date(),
        })
        chatStore.addMessage({
          id: response.id + "_response",
          role: "assistant",
          content: response.content,
          createdAt: new Date(),
        })
      })
    }
    return response
  }, [append, chatStore])

  return {
    messages: chatStore.messages,
    error,
    append: appendMessage,
    isLoading,
    handleModelInit,
  }
}
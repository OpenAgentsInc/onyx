import { fetch as expoFetch } from "expo/fetch"
import { useChat as useVercelChat } from "@ai-sdk/react"
import { useCallback, useEffect } from "react"
import { useStores } from "../models"
import { runInAction } from "mobx"

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

// Create a shared hook that wraps the Vercel AI SDK's useChat
export function useSharedChat() {
  const { chatStore } = useStores()
  
  const {
    messages: vercelMessages,
    error,
    handleSubmit,
    handleInputChange,
    input,
    append,
    isLoading,
  } = useVercelChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: 'https://pro.openagents.com/api/chat-app',
    onError: error => console.error(error, 'ERROR'),
  })

  // Sync Vercel messages to MobX store
  useEffect(() => {
    if (vercelMessages) {
      console.log('Syncing messages to store:', vercelMessages)
      runInAction(() => {
        chatStore.setMessages(vercelMessages)
      })
    }
  }, [vercelMessages, chatStore])

  // Wrap append to ensure correct typing and store sync
  const appendMessage = useCallback(async (message: { role: 'user' | 'assistant', content: string }) => {
    console.log('Appending message:', message)
    const result = await append(message)
    return result
  }, [append])

  return {
    messages: chatStore.messages,
    error,
    handleSubmit,
    handleInputChange,
    input,
    append: appendMessage,
    isLoading,
  }
}
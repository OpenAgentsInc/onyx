import { fetch as expoFetch } from "expo/fetch"
import { useChat as useVercelChat } from "@ai-sdk/react"
import { useCallback } from "react"

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

// Create a shared hook that wraps the Vercel AI SDK's useChat
export function useSharedChat() {
  const {
    messages,
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

  console.log('Raw messages from Vercel:', messages)

  // Ensure messages are in the correct format
  const formattedMessages = messages?.map((m: any) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: m.createdAt ? new Date(m.createdAt) : undefined
  })) || []

  console.log('Formatted messages:', formattedMessages)

  // Wrap append to ensure correct typing
  const appendMessage = useCallback(async (message: { role: 'user' | 'assistant', content: string }) => {
    console.log('Appending message:', message)
    return append(message)
  }, [append])

  return {
    messages: formattedMessages,
    error,
    handleSubmit,
    handleInputChange,
    input,
    append: appendMessage,
    isLoading,
  }
}
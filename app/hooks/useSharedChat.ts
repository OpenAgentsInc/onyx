import { useChat as useVercelChat } from "@ai-sdk/react"
import { fetch as expoFetch } from "expo/fetch"

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

  return {
    messages,
    error,
    handleSubmit,
    handleInputChange,
    input,
    append,
    isLoading,
  }
}
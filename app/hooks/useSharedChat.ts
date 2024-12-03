import { fetch as expoFetch } from "expo/fetch"
import { useChat as useVercelChat } from "@ai-sdk/react"

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

  console.log(messages)

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

import { fetch as expoFetch } from "expo/fetch"
import { runInAction } from "mobx"
import { useCallback, useEffect } from "react"
import { useChat as useVercelChat } from "@ai-sdk/react"
import { useStores } from "../models"
import { Message } from "../models/ChatStore"

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
    fetch: (input, init) => {
      console.log('fetching', input, init)
      return Promise.resolve({
        json: () => Promise.resolve({
          messages: [
            { role: 'user', content: 'Hello!' },
            { role: 'agent', content: 'Hi there!' },
          ],
        }),
      })
    },
    onError: error => console.error(error, 'ERROR'),
  })

  // Sync Vercel messages to MobX store
  useEffect(() => {
    if (vercelMessages) {
      runInAction(() => {
        chatStore.setMessages(vercelMessages)
      })
    }
  }, [vercelMessages, chatStore])

  // Wrap append to ensure correct typing and store sync
  const appendMessage = useCallback(async (message: { role: Message['role'], content: string }) => {
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

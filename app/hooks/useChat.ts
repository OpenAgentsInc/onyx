import { useCallback } from 'react'
import { useStores } from '../models'

export function useChat() {
  const { chatStore } = useStores()

  const submitMessage = useCallback(async (content: string) => {
    try {
      // Add user message
      chatStore.addMessage({
        id: Date.now().toString(),
        role: 'user',
        content
      })

      // Get AI response
      const response = await fetch('https://pro.openagents.com/api/chat-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: chatStore.messages,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      // Add AI response to chat
      chatStore.addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response
      })

    } catch (err) {
      console.error('Failed to submit message:', err)
      throw err
    }
  }, [chatStore])

  return {
    messages: chatStore.messages,
    submitMessage
  }
}
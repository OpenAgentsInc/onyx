import { useCallback } from 'react'
import { useStores } from '../models'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const { chatStore } = useStores()

  const submitMessage = useCallback(async (content: string) => {
    try {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content
      }

      // Add user message to store
      chatStore.addMessage(userMessage)

      // Prepare messages array for API
      const messages = chatStore.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Get AI response
      const response = await fetch('https://pro.openagents.com/api/chat-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          messages
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      
      if (!data || !data.response) {
        throw new Error('Invalid response from API')
      }

      // Add AI response to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response
      }
      chatStore.addMessage(assistantMessage)

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
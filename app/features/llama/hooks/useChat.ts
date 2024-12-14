import { useState, useRef } from 'react'
import type { MessageType } from '@flyerhq/react-native-chat-ui'
import type { LlamaContext } from 'llama.rn'
import { SYSTEM_MESSAGE } from '../constants'

const randId = () => Math.random().toString(36).substr(2, 9)

const USER = { id: 'user' }
const SYSTEM = { id: 'system' }

export function useChat() {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [inferencing, setInferencing] = useState(false)
  const conversationId = useRef(randId())

  const addMessage = (message: MessageType.Any) => {
    setMessages(msgs => [message, ...msgs])
  }

  const addSystemMessage = (text: string, metadata = {}) => {
    const message: MessageType.Text = {
      author: SYSTEM,
      createdAt: Date.now(),
      id: randId(),
      text,
      type: 'text',
      metadata: { system: true, ...metadata }
    }
    addMessage(message)
    return message.id
  }

  const handleCompletion = async (
    context: LlamaContext,
    userMessage: string
  ) => {
    // Add user message
    const userMsg: MessageType.Text = {
      author: USER,
      createdAt: Date.now(),
      id: randId(),
      text: userMessage,
      type: 'text',
      metadata: {
        contextId: context.id,
        conversationId: conversationId.current
      }
    }
    addMessage(userMsg)

    // Prepare message history
    const msgs = [
      SYSTEM_MESSAGE,
      ...[...messages]
        .reverse()
        .map(msg => {
          if (
            !msg.metadata?.system &&
            msg.metadata?.conversationId === conversationId.current &&
            msg.metadata?.contextId === context.id &&
            msg.type === 'text'
          ) {
            return {
              role: msg.author.id === SYSTEM.id ? 'assistant' : 'user',
              content: msg.text
            }
          }
          return { role: '', content: '' }
        })
        .filter(msg => msg.role),
      { role: 'user', content: userMessage }
    ]

    // Start completion
    setInferencing(true)
    const assistantId = randId()
    const createdAt = Date.now()

    try {
      await context.completion(
        {
          messages: msgs,
          n_predict: 400,
          temperature: 0.7,
          top_k: 40,
          top_p: 0.5,
          min_p: 0.05,
          stop: ['</s>', '<|end|>']
        },
        (data) => {
          const { token } = data
          setMessages(msgs => {
            const index = msgs.findIndex(msg => msg.id === assistantId)
            if (index >= 0) {
              return msgs.map((msg, i) => {
                if (msg.type === 'text' && i === index) {
                  return {
                    ...msg,
                    text: (msg.text + token).replace(/^\\s+/, '')
                  }
                }
                return msg
              })
            }
            return [
              {
                author: SYSTEM,
                createdAt,
                id: assistantId,
                text: token,
                type: 'text',
                metadata: {
                  contextId: context.id,
                  conversationId: conversationId.current
                }
              },
              ...msgs
            ]
          })
        }
      )
    } catch (error: any) {
      addSystemMessage(`Completion failed: ${error.message}`)
    } finally {
      setInferencing(false)
    }
  }

  return {
    messages,
    inferencing,
    addSystemMessage,
    handleCompletion
  }
}
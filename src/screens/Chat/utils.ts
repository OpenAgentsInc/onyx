// utils.ts
import type { MessageType } from '@flyerhq/react-native-chat-ui'
import type { LlamaContext } from 'llama.rn'
import { randId, system } from "./constants"

export const addMessage = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType.Any[]>>,
  messages: MessageType.Any[],
  message: MessageType.Any,
  batching = false
) => {
  if (batching) {
    setMessages([message, ...messages])
  } else {
    setMessages((msgs) => [message, ...msgs])
  }
}

export const addSystemMessage = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType.Any[]>>,
  messages: MessageType.Any[],
  text: string,
  metadata = {}
) => {
  const textMessage: MessageType.Text = {
    author: system,
    createdAt: Date.now(),
    id: randId(),
    text,
    type: 'text',
    metadata: { system: true, ...metadata },
  }
  addMessage(setMessages, messages, textMessage)
  return textMessage.id
}

export const handleReleaseContext = async (
  context: LlamaContext | undefined,
  setContext: React.Dispatch<React.SetStateAction<LlamaContext | undefined>>,
  setMessages: React.Dispatch<React.SetStateAction<MessageType.Any[]>>,
  messages: MessageType.Any[],
  addSystemMessageFn: typeof addSystemMessage
) => {
  if (!context) return
  addSystemMessageFn(setMessages, messages, 'Releasing context...')
  context
    .release()
    .then(() => {
      setContext(undefined)
      addSystemMessageFn(setMessages, [], 'Context released!')
    })
    .catch((err) => {
      addSystemMessageFn(setMessages, [], `Context release failed: ${err}`)
    })
}

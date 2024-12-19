import { MessageType } from "@flyerhq/react-native-chat-ui"

let addMessageCallback: ((message: MessageType.Any) => void) | null = null
let messagesState: MessageType.Any[] = []

export const useLlamaChat = () => {
  const setAddMessageCallback = (callback: (message: MessageType.Any) => void) => {
    addMessageCallback = callback
  }

  const setMessages = (messages: MessageType.Any[]) => {
    messagesState = messages
  }

  const addUserMessage = (text: string) => {
    if (!addMessageCallback) {
      console.error('No message callback set')
      return
    }

    const message: MessageType.Text = {
      author: { id: 'y9d7f8pgn' }, // This matches the user ID in LlamaRNExample
      createdAt: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
      text,
      type: 'text',
    }

    addMessageCallback(message)
  }

  return {
    setAddMessageCallback,
    setMessages,
    addUserMessage,
  }
}

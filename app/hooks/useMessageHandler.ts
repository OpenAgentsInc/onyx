import { MessageType } from "@flyerhq/react-native-chat-ui"

type HandleMessageFunction = (message: MessageType.PartialText) => Promise<void>
let handleMessageCallback: HandleMessageFunction | null = null

export const useMessageHandler = () => {
  const setHandleMessage = (callback: HandleMessageFunction) => {
    handleMessageCallback = callback
  }

  const handleMessage = async (text: string) => {
    if (!handleMessageCallback) {
      console.error('No message handler set')
      return
    }

    await handleMessageCallback({ text })
  }

  return {
    setHandleMessage,
    handleMessage,
  }
}
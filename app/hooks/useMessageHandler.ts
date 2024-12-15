import { MessageType } from "@flyerhq/react-native-chat-ui"

type HandleMessageFunction = (message: MessageType.PartialText) => Promise<void>
let handleMessageCallback: HandleMessageFunction | null = null

export const useMessageHandler = () => {
  const setHandleMessage = (callback: HandleMessageFunction) => {
    console.log("Setting message handler", !!callback)
    handleMessageCallback = callback
  }

  const handleMessage = async (text: string) => {
    console.log("handleMessage called with:", text)
    if (!handleMessageCallback) {
      console.error('No message handler set')
      return
    }

    try {
      const partialMessage: MessageType.PartialText = {
        text,
        type: 'text'
      }
      console.log("Calling message handler with:", partialMessage)
      await handleMessageCallback(partialMessage)
    } catch (err) {
      console.error("Error in handleMessage:", err)
    }
  }

  return {
    setHandleMessage,
    handleMessage,
  }
}

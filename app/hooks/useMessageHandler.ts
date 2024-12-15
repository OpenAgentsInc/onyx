import { MessageType } from "@flyerhq/react-native-chat-ui"

// Create a singleton instance that persists across hook instances
let globalHandler: ((message: MessageType.PartialText) => Promise<void>) | null = null

export const useMessageHandler = () => {
  const setHandleMessage = (callback: (message: MessageType.PartialText) => Promise<void>) => {
    console.log("Setting message handler")
    globalHandler = callback
  }

  const handleMessage = async (text: string) => {
    console.log("handleMessage called with:", text)
    if (!globalHandler) {
      console.error('No message handler set')
      return
    }

    try {
      const partialMessage: MessageType.PartialText = {
        text,
        type: 'text'
      }
      console.log("Calling message handler with:", partialMessage)
      await globalHandler(partialMessage)
    } catch (err) {
      console.error("Error in handleMessage:", err)
    }
  }

  return {
    setHandleMessage,
    handleMessage,
  }
}
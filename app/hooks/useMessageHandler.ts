import { MessageType } from "@flyerhq/react-native-chat-ui"
import { useRef } from "react"

type HandleMessageFunction = (message: MessageType.PartialText) => Promise<void>

export const useMessageHandler = () => {
  // Use a ref to store the callback to prevent unnecessary re-renders
  const callbackRef = useRef<HandleMessageFunction | null>(null)

  const setHandleMessage = (callback: HandleMessageFunction) => {
    // Only update if the callback is different
    if (callbackRef.current !== callback) {
      console.log("Setting new message handler")
      callbackRef.current = callback
    }
  }

  const handleMessage = async (text: string) => {
    console.log("handleMessage called with:", text)
    if (!callbackRef.current) {
      console.error('No message handler set')
      return
    }

    try {
      const partialMessage: MessageType.PartialText = {
        text,
        type: 'text'
      }
      console.log("Calling message handler with:", partialMessage)
      await callbackRef.current(partialMessage)
    } catch (err) {
      console.error("Error in handleMessage:", err)
    }
  }

  return {
    setHandleMessage,
    handleMessage,
  }
}
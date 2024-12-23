import { useEffect } from "react"
import { useStores } from "@/models"
import { ChatStore } from "@/models/chat/store"

export const useInitialContext = () => {
  const { chatStore } = useStores() as { chatStore: ChatStore }
  
  useEffect(() => {
    // Create a temporary context if none exists
    if (!chatStore.activeContext) {
      const contextId = "temp-" + Math.random().toString(36).substring(7)
      chatStore.addContext(contextId, "default-model")
      chatStore.setActiveModel("default-model")
    }
  }, [chatStore])
}
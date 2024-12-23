import { useEffect } from "react"
import { useChatStore } from "./useChatStore"
import { useStores } from "@/models"

export const useInitialContext = () => {
  const { chatStore } = useStores()
  
  useEffect(() => {
    // Create a temporary context if none exists
    if (!chatStore.activeContext) {
      const contextId = "temp-" + Math.random().toString(36).substring(7)
      chatStore.addContext(contextId, "default-model")
      chatStore.setActiveModel("default-model")
    }
  }, [chatStore])
}
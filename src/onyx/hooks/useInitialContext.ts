import { useEffect } from "react"
import { useStores } from "@/models"
import { ChatStore } from "@/models/chat/store"
import { log } from "@/utils/log"

export const useInitialContext = () => {
  const { chatStore } = useStores() as { chatStore: ChatStore }
  
  useEffect(() => {
    // Create a temporary context if none exists
    if (!chatStore.activeContext) {
      log({ 
        name: "[useInitialContext] No active context found",
        value: { activeModelKey: chatStore.activeModelKey }
      })

      // TODO: Replace with actual model path from LLMStore
      // For now using a placeholder that will be replaced by model picker
      const modelPath = "default-model"
      const contextId = "temp-" + Math.random().toString(36).substring(7)

      chatStore.initializeContext(
        contextId,
        modelPath,
        null, // No LoRA for now
        (progress) => {
          log({ 
            name: "[useInitialContext] Loading model",
            value: { progress }
          })
        }
      ).catch(error => {
        log({
          name: "[useInitialContext] Failed to initialize context",
          value: error
        })
        chatStore.setError("Failed to initialize model context")
      })
    }
  }, [chatStore])
}
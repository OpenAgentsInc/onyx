import { useEffect } from "react"
import { useStores } from "@/models"
import { ChatStore } from "@/models/chat/store"
import { log } from "@/utils/log"
import { DEFAULT_MODEL_KEY } from "@/screens/Chat/constants"

export const useInitialContext = () => {
  const { chatStore, llmStore } = useStores() as { 
    chatStore: ChatStore,
    llmStore: any // TODO: Add proper type
  }
  
  useEffect(() => {
    // Create a temporary context if none exists
    if (!chatStore.activeContext) {
      log({ 
        name: "[useInitialContext] No active context found",
        value: { 
          llmStoreInitialized: llmStore.isInitialized,
          selectedModelKey: llmStore.selectedModelKey,
          models: llmStore.models.map((m: any) => ({
            key: m.key,
            status: m.status,
            path: m.path
          }))
        }
      })

      // If LLM store isn't initialized, initialize it
      if (!llmStore.isInitialized) {
        llmStore.initialize().catch((error: Error) => {
          log({
            name: "[useInitialContext] Failed to initialize LLM store",
            value: error
          })
          chatStore.setError("Failed to initialize model store")
          return
        })
      }

      // Get the selected model or default model
      const modelKey = llmStore.selectedModelKey || DEFAULT_MODEL_KEY
      const model = llmStore.models.find((m: any) => m.key === modelKey)

      if (!model) {
        log({
          name: "[useInitialContext] Model not found",
          value: { modelKey }
        })
        chatStore.setError("Model not found")
        return
      }

      // If model isn't ready, start download
      if (model.status !== "ready") {
        log({
          name: "[useInitialContext] Starting model download",
          value: { modelKey, status: model.status }
        })
        llmStore.startModelDownload(modelKey).catch((error: Error) => {
          log({
            name: "[useInitialContext] Failed to download model",
            value: error
          })
          chatStore.setError("Failed to download model")
        })
        return
      }

      // Initialize chat context with model
      const contextId = "ctx-" + Math.random().toString(36).substring(7)
      
      chatStore.initializeContext(
        contextId,
        model.path!, // We know it's not null because status is "ready"
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
  }, [chatStore, llmStore])
}
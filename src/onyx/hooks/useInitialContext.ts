import { useEffect } from "react"
import { useStores } from "@/models"
import { ChatStore } from "@/models/chat/store"
import { DEFAULT_MODEL_KEY } from "@/screens/Chat/constants"
import { log } from "@/utils/log"

export const useInitialContext = () => {
  const { chatStore, llmStore } = useStores() as {
    chatStore: ChatStore,
    llmStore: any // TODO: Add proper type
  }

  useEffect(() => {
    const initContext = async () => {
      // Create a temporary context if none exists
      if (!chatStore.activeContext) {
        log({
          name: "[useInitialContext] Starting initialization",
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
          log({ name: "[useInitialContext] Initializing LLM store" })
          try {
            await llmStore.initialize()
            log({
              name: "[useInitialContext] LLM store initialized",
              value: {
                models: llmStore.models.map((m: any) => ({
                  key: m.key,
                  status: m.status,
                  path: m.path
                }))
              }
            })
          } catch (error) {
            log({
              name: "[useInitialContext] Failed to initialize LLM store",
              value: error,
              important: true
            })
            chatStore.setError("Failed to initialize model store")
            return
          }
        }

        // Get the selected model or default model
        const modelKey = llmStore.selectedModelKey || DEFAULT_MODEL_KEY
        log({
          name: "[useInitialContext] Looking for model",
          value: { modelKey }
        })

        const model = llmStore.models.find((m: any) => m.key === modelKey)

        if (!model) {
          log({
            name: "[useInitialContext] Model not found",
            value: {
              modelKey,
              availableModels: llmStore.models.map((m: any) => m.key)
            },
            important: true
          })
          chatStore.setError("Model not found")
          return
        }

        log({
          name: "[useInitialContext] Found model",
          value: {
            key: model.key,
            status: model.status,
            path: model.path
          }
        })

        // If model isn't ready, start download
        if (model.status !== "ready") {
          log({
            name: "[useInitialContext] Starting model download",
            value: { modelKey, status: model.status }
          })
          try {
            await llmStore.startModelDownload(modelKey)
            log({
              name: "[useInitialContext] Model download complete",
              value: {
                key: model.key,
                status: model.status,
                path: model.path
              }
            })
          } catch (error) {
            log({
              name: "[useInitialContext] Failed to download model",
              value: error,
              important: true
            })
            chatStore.setError("Failed to download model")
            return
          }
        }

        // Initialize chat context with model
        const contextId = "ctx-" + Math.random().toString(36).substring(7)

        log({
          name: "[useInitialContext] Initializing chat context",
          value: {
            contextId,
            modelPath: model.path,
            modelStatus: model.status
          }
        })

        try {
          const result = await chatStore.initializeContext(
            contextId,
            model.path!, // We know it's not null because status is "ready"
            null, // No LoRA for now
            (progress) => {
              log({
                name: "[useInitialContext] Loading model",
                value: { progress }
              })
            }
          )
          log({
            name: "[useInitialContext] Chat context initialized",
            value: result,
            important: true
          })
        } catch (error) {
          console.log(error)
          log({
            name: "[useInitialContext] Failed to initialize context",
            value: {
              error,
              modelPath: model.path,
              modelStatus: model.status
            },
            important: true
          })
          chatStore.setError("Failed to initialize model context")
        }
      }
    }

    initContext().catch(error => {
      log({
        name: "[useInitialContext] Unhandled error",
        value: error,
        important: true
      })
      chatStore.setError("Unhandled error in context initialization")
    })
  }, [chatStore, llmStore])
}

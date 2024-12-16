import { useCallback, useEffect, useRef, useState } from "react"
import { useStores } from "@/models"
import { SYSTEM_MESSAGE } from "@/features/llama/constants"
import { handleCommand } from "@/services/llama/LlamaCommands"
import { getModelInfo, initializeLlamaContext } from "@/services/llama/LlamaContext"
import { LlamaModelManager } from "@/services/llama/LlamaModelManager"
import { LlamaContext } from "@/services/llama/LlamaTypes"

const randId = () => Math.random().toString(36).substr(2, 9)

interface ChatResponse {
  role: string
  content: string
  id: string
}

export function useLlamaVercelChat() {
  const { modelStore } = useStores()
  const context = modelStore.context as LlamaContext
  const [inferencing, setInferencing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const conversationIdRef = useRef<string>("default")
  const modelManager = LlamaModelManager.getInstance()
  const hasInitializedRef = useRef(false)

  const initializeModel = async () => {
    if (isInitializing || hasInitializedRef.current) return
    setIsInitializing(true)
    
    try {
      // Release any existing context first
      await modelManager.releaseContext()
      // Wait for release to complete
      await modelManager.waitForRelease()

      const modelPath = await modelManager.ensureModelExists((progress) => {
        console.log(`Model download progress: ${progress}%`)
      })

      if (!modelPath) {
        throw new Error("Failed to get model path")
      }

      await getModelInfo(modelPath)
      console.log("Initializing context...")

      const t0 = Date.now()
      const ctx = await initializeLlamaContext({
        uri: modelPath,
        name: "model.gguf",
        size: 0,
        type: "application/octet-stream",
        fileCopyUri: null,
      }, null, (progress) => {
        console.log(`Initializing context... ${progress}%`)
      })

      const t1 = Date.now()
      modelStore.setContext(new LlamaContext(ctx))
      modelManager.setContext(ctx)
      hasInitializedRef.current = true
      console.log(
        `Context initialized! Load time: ${t1 - t0}ms GPU: ${ctx.gpu ? "YES" : "NO"} (${
          ctx.reasonNoGPU
        }) Chat Template: ${ctx.model.isChatTemplateSupported ? "YES" : "NO"}`
      )
    } catch (err: any) {
      console.error("Context initialization failed:", err)
      setError(new Error(`Context initialization failed: ${err.message}`))
      hasInitializedRef.current = false
      modelStore.setContext(null)
      await modelManager.releaseContext()
    } finally {
      setIsInitializing(false)
    }
  }

  // Auto-initialize on mount
  useEffect(() => {
    if (!hasInitializedRef.current && !modelManager.hasActiveContext()) {
      initializeModel()
    }
    return () => {
      // Cleanup
      modelManager.releaseContext()
    }
  }, [])

  const append = useCallback(
    async (message: { role: string; content: string }): Promise<ChatResponse | undefined> => {
      if (!context) {
        if (!hasInitializedRef.current) {
          await initializeModel()
        }
        return undefined
      }

      setInferencing(true)
      try {
        // Handle commands
        if (message.content.startsWith("/")) {
          const isCommand = await handleCommand(
            message.content,
            context,
            inferencing,
            console.log,
            () => {
              conversationIdRef.current = randId()
            }
          )
          if (isCommand) return undefined
        }

        const msgs = [
          SYSTEM_MESSAGE,
          { role: "user", content: message.content },
        ]

        const formattedChat = (await context?.getFormattedChat(msgs)) || ""
        const { tokens } = (await context?.tokenize(formattedChat)) || {}
        console.log(
          "Formatted:",
          `"${formattedChat}"`,
          "\nTokenize:",
          tokens,
          `(${tokens?.length} tokens)`
        )

        let fullResponse = ""
        const completionResult = await context?.completion(
          {
            messages: msgs,
            n_predict: 1000,
            seed: -1,
            n_probs: 0,
            top_k: 40,
            top_p: 0.5,
            min_p: 0.05,
            temperature: 0.7,
            penalty_last_n: 64,
            penalty_repeat: 1.0,
            stop: [
              "</s>",
              "<|end|>",
              "<|im_end|>",
              "<|EOT|>",
              "<|end_of_turn|>",
              "<|endoftext|>",
              "</tool>",
            ],
          },
          async (data) => {
            const { token } = data
            fullResponse += token
          }
        )

        if (completionResult) {
          return {
            role: "assistant",
            content: fullResponse,
            id: randId(),
          }
        }
        return undefined
      } catch (e: any) {
        console.error("Completion error:", e)
        setError(new Error(`Completion failed: ${e.message}`))
        return undefined
      } finally {
        setInferencing(false)
      }
    },
    [context, inferencing]
  )

  return {
    append,
    error,
    isLoading: inferencing || isInitializing,
    handleModelInit: initializeModel,
  }
}
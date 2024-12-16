import { useCallback, useEffect, useRef, useState } from "react"
import { useStores } from "@/models"
import { SYSTEM_MESSAGE } from "@/features/llama/constants"
import { handleCommand } from "@/services/llama/LlamaCommands"
import { pickModel } from "@/services/llama/LlamaFileUtils"
import { getModelInfo, initializeLlamaContext, handleContextRelease } from "@/services/llama/LlamaContext"

const randId = () => Math.random().toString(36).substr(2, 9)

export function useLlamaVercelChat() {
  const { modelStore } = useStores()
  const context = modelStore.context
  const [inferencing, setInferencing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const conversationIdRef = useRef<string>("default")

  const handleModelInit = async () => {
    try {
      const modelFile = await pickModel((text) => console.log(text))
      if (!modelFile) return

      await handleContextRelease(
        context,
        () => {
          modelStore.setContext(null)
          console.log("Context released!")
        },
        (err) => {
          console.error(`Context release failed: ${err}`)
          setError(new Error(`Context release failed: ${err}`))
        }
      )

      await getModelInfo(modelFile.uri)
      console.log("Initializing context...")

      const t0 = Date.now()
      const ctx = await initializeLlamaContext(modelFile, null, (progress) => {
        console.log(`Initializing context... ${progress}%`)
      })

      const t1 = Date.now()
      modelStore.setContext(ctx)
      console.log(
        `Context initialized! Load time: ${t1 - t0}ms GPU: ${ctx.gpu ? "YES" : "NO"} (${
          ctx.reasonNoGPU
        }) Chat Template: ${ctx.model.isChatTemplateSupported ? "YES" : "NO"}`
      )
    } catch (err: any) {
      console.error("Context initialization failed:", err)
      setError(new Error(`Context initialization failed: ${err.message}`))
    }
  }

  const append = useCallback(
    async (message: { role: string; content: string }) => {
      if (!context) {
        await handleModelInit()
        return
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
          if (isCommand) return
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
      } catch (e: any) {
        console.error("Completion error:", e)
        setError(new Error(`Completion failed: ${e.message}`))
      } finally {
        setInferencing(false)
      }
    },
    [context, inferencing]
  )

  return {
    append,
    error,
    isLoading: inferencing,
    handleModelInit,
  }
}
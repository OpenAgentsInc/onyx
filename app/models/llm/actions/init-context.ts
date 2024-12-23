import { flow } from "mobx-state-tree"
import { ILLMStore } from "../"
import { log } from "@/utils/log"
import { Platform } from "react-native"
import { initLlama } from "llama.rn"

interface LlamaContext {
  id: string
  gpu: boolean
  reasonNoGPU: string
  model: {
    isChatTemplateSupported: boolean
  }
}

export const withInitContext = (self: ILLMStore) => ({
  initContext: flow(function* (): Generator<any, LlamaContext, any> {
    try {
      const model = self.models.find(m => m.key === self.selectedModelKey)
      if (!model) {
        throw new Error("No model selected")
      }

      if (model.status !== "ready") {
        throw new Error("Selected model is not ready")
      }

      const modelPath = model.path
      if (!modelPath) {
        throw new Error("Model path not found")
      }

      log({
        name: "[LLMStore] Init Context",
        preview: "Initializing context for model",
        value: modelPath
      })

      const context = yield initLlama({
        model: modelPath,
        use_mlock: true,
        n_gpu_layers: Platform.OS === "ios" ? 99 : 0, // Enable GPU on iOS
      })

      log({
        name: "[LLMStore] Init Context",
        preview: "Context initialized",
        value: {
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU,
          isChatTemplateSupported: context.model.isChatTemplateSupported
        }
      })

      self.context = context
      self.isInitialized = true
      self.error = null

      return context

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      log({
        name: "[LLMStore] Init Context",
        preview: "Error",
        value: errorMessage,
        important: true
      })
      self.error = errorMessage
      throw error
    }
  })
})
import { flow } from "mobx-state-tree"
import { ILLMStore } from "../"
import { log } from "@/utils/log"
import { Platform } from "react-native"
import type { LlamaContext } from "llama.rn"

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

      log("[LLMStore] Initializing context for model:", modelPath)

      const context = yield self.localModelService.init({
        model: modelPath,
        use_mlock: true,
        n_gpu_layers: Platform.OS === "ios" ? 99 : 0, // Enable GPU on iOS
      })

      log("[LLMStore] Context initialized:", {
        gpu: context.gpu,
        reasonNoGPU: context.reasonNoGPU,
        isChatTemplateSupported: context.model.isChatTemplateSupported
      })

      self.context = context
      self.isInitialized = true
      self.error = null

      return context

    } catch (error) {
      log("[LLMStore] Init context error:", error)
      self.error = error instanceof Error ? error.message : "Failed to initialize context"
      throw error
    }
  })
})
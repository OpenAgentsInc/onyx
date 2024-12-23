import { flow } from "mobx-state-tree"
import { ILLMStore } from "../"
import { log } from "@/utils/log"
import { Platform } from "react-native"

export const withInitContext = (self: ILLMStore) => {
  return {
    initContext: flow(function* () {
      try {
        if (!self.selectedModel) {
          throw new Error("No model selected")
        }

        if (self.selectedModel.status !== "ready") {
          throw new Error("Selected model is not ready")
        }

        // Initialize Llama context
        const modelPath = self.selectedModel.path
        if (!modelPath) {
          throw new Error("Model path not found")
        }

        log.info("[LLMStore] Initializing context for model:", modelPath)

        const context = yield self.localModelService.initLlama({
          model: modelPath,
          use_mlock: true,
          n_gpu_layers: Platform.OS === "ios" ? 99 : 0, // Enable GPU on iOS
        })

        log.info("[LLMStore] Context initialized:", {
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU,
          isChatTemplateSupported: context.model.isChatTemplateSupported
        })

        self.context = context
        self.isInitialized = true
        self.error = null

        return context

      } catch (error) {
        log.error("[LLMStore] Init context error:", error)
        self.error = error instanceof Error ? error.message : "Failed to initialize context"
        throw error
      }
    })
  }
}
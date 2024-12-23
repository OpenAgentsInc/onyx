import { flow } from "mobx-state-tree"
import { ILLMStore } from "../"
import { log } from "@/utils/log"
import { Platform } from "react-native"
import { initLlama, type LlamaContext } from "llama.rn"

export const withInitContext = (self: ILLMStore) => ({
  initContext: flow(function* () {
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

      const t0 = Date.now()

      // Handle initLlama as a Promise instead of yielding
      const context = yield new Promise<LlamaContext>((resolve, reject) => {
        initLlama({
          model: modelPath,
          use_mlock: true,
          n_gpu_layers: Platform.OS === "ios" ? 99 : 0, // Enable GPU on iOS
        }, (progress) => {
          log({
            name: "[LLMStore] Init Context",
            preview: "Progress",
            value: `${progress}%`
          })
        })
        .then((ctx) => {
          const t1 = Date.now()
          log({
            name: "[LLMStore] Init Context",
            preview: "Context initialized",
            value: {
              loadTime: `${t1 - t0}ms`,
              gpu: ctx.gpu,
              reasonNoGPU: ctx.reasonNoGPU,
              isChatTemplateSupported: ctx.model.isChatTemplateSupported
            }
          })
          resolve(ctx)
        })
        .catch(reject)
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
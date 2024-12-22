import { flow } from "mobx-state-tree"
import { LocalModelService } from "@/services/local-models/LocalModelService"
import { ILLMStore, IModelInfo } from "../types"

export const withInitialize = (self: ILLMStore) => ({
  initialize: flow(function* () {
    try {
      const localModelService = new LocalModelService()

      // Fetch info for all models
      const models = yield localModelService.getLocalModels()
      self.models.replace(models)

      // If we have a ready model, select it
      const readyModel = models.find((m: IModelInfo) => m.status === "ready")
      if (readyModel) {
        self.selectedModelKey = readyModel.key
      }

      self.isInitialized = true
      self.error = null

      console.tron.display({
        name: "LLMStore",
        value: self,
        preview: "Initialized",
        important: true,
      })
    } catch (error) {
      console.error("[LLMStore] Initialization error:", error)
      self.error = error instanceof Error ? error.message : "Failed to initialize LLM store"
      throw error
    }
  })
})

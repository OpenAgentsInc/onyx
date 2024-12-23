import { flow } from "mobx-state-tree"
import { LocalModelService } from "@/services/local-models/LocalModelService"
import { ILLMStore, IModelInfo } from "../types"

export const withStartModelDownload = (self: ILLMStore) => {
  const localModelService = new LocalModelService()

  return {
    startModelDownload: flow(function* (modelKey: string) {
      try {
        // Find model in store
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex === -1) {
          throw new Error("Model not found")
        }

        // Update status
        self.models[modelIndex].status = "downloading"
        self.models[modelIndex].error = undefined

        // Start download
        const finalPath = yield localModelService.startDownload(modelKey, (progress) => {
          self.updateModelProgress(modelKey, progress)
        })

        // Update model info
        self.models[modelIndex].path = finalPath
        self.models[modelIndex].status = "ready"
        self.models[modelIndex].progress = 100

        // Select this model if none selected
        if (!self.selectedModelKey) {
          self.selectedModelKey = modelKey
        }

        self.error = null
      } catch (error) {
        console.error("[LLMStore] Download error:", error)
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "error"
          self.models[modelIndex].error = error instanceof Error ? error.message : "Download failed"
        }
        self.error = error instanceof Error ? error.message : "Failed to download model"
      }
    })
  }
}
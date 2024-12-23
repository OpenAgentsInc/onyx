import { flow } from "mobx-state-tree"
import { LocalModelService } from "@/services/local-models/LocalModelService"
import { ILLMStore, IModelInfo } from "../"

export const withDeleteModel = (self: ILLMStore) => {
  const localModelService = new LocalModelService()

  return {
    deleteModel: flow(function* (modelKey: string) {
      try {
        yield localModelService.deleteModel(modelKey)

        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "idle"
          self.models[modelIndex].path = null
          self.models[modelIndex].progress = 0
          self.models[modelIndex].error = undefined
        }

        // If this was the selected model, clear selection
        if (self.selectedModelKey === modelKey) {
          self.selectedModelKey = null
        }

        self.error = null
      } catch (error) {
        console.error("[LLMStore] Delete model error:", error)
        self.error = error instanceof Error ? error.message : "Failed to delete model"
      }
    })
  }
}

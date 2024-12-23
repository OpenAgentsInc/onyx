import { flow } from "mobx-state-tree"
import { LocalModelService } from "@/services/local-models/LocalModelService"
import { ILLMStore, IModelInfo } from "../"

export const withCancelModelDownload = (self: ILLMStore) => {
  const localModelService = new LocalModelService()

  return {
    cancelModelDownload: flow(function* (modelKey: string) {
      try {
        yield localModelService.cancelDownload()

        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "idle"
          self.models[modelIndex].progress = 0
          self.models[modelIndex].error = undefined
        }

        self.error = null
      } catch (error) {
        console.error("[LLMStore] Cancel download error:", error)
        self.error = error instanceof Error ? error.message : "Failed to cancel download"
      }
    })
  }
}

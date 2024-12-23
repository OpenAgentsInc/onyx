import { ILLMStore, IModelInfo } from "./types"

export const withViews = (self: ILLMStore) => ({
  get selectedModel() {
    return self.selectedModelKey 
      ? self.models.find((m: IModelInfo) => m.key === self.selectedModelKey) ?? null
      : null
  },
  
  get downloadingModel() {
    return self.models.find((m: IModelInfo) => m.status === "downloading") ?? null
  },
  
  get hasReadyModel() {
    return self.models.some((m: IModelInfo) => m.status === "ready")
  }
})
import { LLMStore } from "./types"

export const withViews = (self: LLMStore) => ({
  get selectedModel() {
    return self.selectedModelKey 
      ? self.models.find(m => m.key === self.selectedModelKey) ?? null
      : null
  },
  
  get downloadingModel() {
    return self.models.find(m => m.status === "downloading") ?? null
  },
  
  get hasReadyModel() {
    return self.models.some(m => m.status === "ready")
  }
})
import { ILLMStore } from "../types"

export const withSelectModel = (self: ILLMStore) => ({
  selectModel(modelKey: string | null) {
    self.selectedModelKey = modelKey
  }
})
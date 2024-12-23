import { ILLMStore } from "../"

export const withSelectModel = (self: ILLMStore) => ({
  selectModel(modelKey: string | null) {
    self.selectedModelKey = modelKey
  }
})

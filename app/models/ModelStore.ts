import { Instance, types } from "mobx-state-tree"
import type { LlamaContext } from "llama.rn"

export const ModelStoreModel = types
  .model("ModelStore")
  .props({
    context: types.frozen<LlamaContext | null>(null),
  })
  .actions((store) => ({
    setContext(context: LlamaContext | null) {
      store.context = context
    },
  }))

export interface ModelStore extends Instance<typeof ModelStoreModel> {}
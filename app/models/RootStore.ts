import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreModel } from "./ChatStore"
import { RecordingStoreModel } from "./RecordingStore"
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

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  chatStore: types.optional(ChatStoreModel, {}),
  recordingStore: types.optional(RecordingStoreModel, {}),
  modelStore: types.optional(ModelStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
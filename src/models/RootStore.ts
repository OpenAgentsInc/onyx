import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreModel } from "./ChatStore"
import { LLMStoreModel } from "./LLMStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  chatStore: types.optional(ChatStoreModel, {}),
  llmStore: types.optional(LLMStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }

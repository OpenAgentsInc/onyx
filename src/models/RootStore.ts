import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreModel } from "./chat/store"
import { LLMStoreModel } from "./LLMStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  chatStore: types.optional(ChatStoreModel, {
    isInitialized: false,
    error: null,
    messages: [],
    activeModelKey: null,
    inferencing: false,
  }),
  llmStore: types.optional(LLMStoreModel, {
    isInitialized: false,
    error: null,
    models: [],
    selectedModelKey: null,
  }),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
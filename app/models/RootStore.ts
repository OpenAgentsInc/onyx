import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { LLMStoreModel } from "./llm"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
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
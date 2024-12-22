import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { LLMStoreModel, createLLMStoreDefaultModel } from "./llm/store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  llmStore: types.optional(LLMStoreModel, () => createLLMStoreDefaultModel()),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
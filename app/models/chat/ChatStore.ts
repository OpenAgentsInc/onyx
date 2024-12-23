import {
  Instance, IStateTreeNode, SnapshotIn, SnapshotOut, types
} from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"

// Store Model
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

export const createLLMStoreDefaultModel = () =>
  ChatStoreModel.create({
    isInitialized: false,
    error: null,
  })

// Types
export interface IChatStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  selectedModelKey: string | null
  updateModelProgress(modelKey: string, progress: number): void
}

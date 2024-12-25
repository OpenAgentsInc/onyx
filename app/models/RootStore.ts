import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreWithActions } from "./chat/ChatStore"
import { ToolStoreModel } from "./tools"

const RootStoreModel = types
  .model("RootStore")
  .props({
    chatStore: types.optional(ChatStoreWithActions, {}),
    toolStore: types.optional(ToolStoreModel, {
      tools: [],
      isInitialized: false,
      error: null,
    })
  })

export interface IRootStore extends Instance<typeof RootStoreModel> { }
export interface RootStoreSnapshotOut extends SnapshotOut<typeof RootStoreModel> { }
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStoreModel> { }

export { RootStoreModel }
export type RootStore = Instance<typeof RootStoreModel>

export const createRootStoreDefaultModel = () =>
  RootStoreModel.create({
    chatStore: {},
    toolStore: {
      tools: [],
      isInitialized: false,
      error: null,
    }
  })
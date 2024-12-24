import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreWithActions } from "./chat/ChatStore"
import { ToolStoreModel } from "./tools"

export const RootStoreModel = types.model("RootStore").props({
  chatStore: types.optional(ChatStoreWithActions, {}),
  toolStore: types.optional(ToolStoreModel, {})
})

export interface RootStore extends Instance<typeof RootStoreModel> { }
export interface RootStoreSnapshotOut extends SnapshotOut<typeof RootStoreModel> { }
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStoreModel> { }

export const createRootStoreDefaultModel = () =>
  RootStoreModel.create({
    chatStore: {},
    toolStore: {}
  })

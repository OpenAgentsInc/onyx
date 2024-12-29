import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { ChatStoreModel } from "./chat/ChatStore"
import { CoderStoreModel } from "./coder/CoderStore"

const RootStoreModel = types
  .model("RootStore")
  .props({
    chatStore: types.optional(ChatStoreModel, {}),
    coderStore: types.optional(CoderStoreModel, {
      error: null,
      githubToken: "",
      repos: [],
      activeRepoIndex: null,
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
    coderStore: {
      error: null,
      githubToken: "",
      repos: [],
      activeRepoIndex: null,
    }
  })

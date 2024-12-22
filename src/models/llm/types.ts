import { Instance, types } from "mobx-state-tree"
import { LLMStoreModel } from "./store"

export interface LLMStore extends Instance<typeof LLMStoreModel> { }

export const ModelInfoModel = types.model("ModelInfo", {
  key: types.string,
  displayName: types.string,
  path: types.maybeNull(types.string),
  status: types.enumeration(["idle", "downloading", "initializing", "ready", "error"]),
  progress: types.number,
  error: types.maybe(types.string),
})
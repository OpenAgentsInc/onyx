import { Instance, types } from "mobx-state-tree"

export const ModelInfoModel = types.model("ModelInfo", {
  key: types.string,
  displayName: types.string,
  path: types.maybeNull(types.string),
  status: types.enumeration(["idle", "downloading", "initializing", "ready", "error"]),
  progress: types.number,
  error: types.maybe(types.string),
})

export interface IModelInfo extends Instance<typeof ModelInfoModel> {}

// Base store interface without the circular reference
export interface ILLMStore {
  isInitialized: boolean
  error: string | null
  models: IModelInfo[]
  selectedModelKey: string | null
}
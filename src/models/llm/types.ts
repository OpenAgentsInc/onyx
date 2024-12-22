import { Instance, IStateTreeNode, types } from "mobx-state-tree"

export const ModelInfoModel = types.model("ModelInfo", {
  key: types.string,
  displayName: types.string,
  path: types.maybeNull(types.string),
  status: types.enumeration(["idle", "downloading", "initializing", "ready", "error"]),
  progress: types.number,
  error: types.maybe(types.string),
})

export interface IModelInfo extends Instance<typeof ModelInfoModel> {}

// Base store interface with MST array type
export interface ILLMStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  models: IModelInfo[] & {
    replace(items: IModelInfo[]): void
  }
  selectedModelKey: string | null
}
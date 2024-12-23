import { Instance, IStateTreeNode, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { withInitialize } from "./llm/actions/initialize"
import { withStartModelDownload } from "./llm/actions/start-model-download"
import { withCancelModelDownload } from "./llm/actions/cancel-model-download"
import { withDeleteModel } from "./llm/actions/delete-model"
import { withSelectModel } from "./llm/actions/select-model"

// Types
export const ModelInfoModel = types.model("ModelInfo", {
  key: types.string,
  displayName: types.string,
  path: types.maybeNull(types.string),
  status: types.enumeration(["idle", "downloading", "initializing", "ready", "error"]),
  progress: types.number,
  error: types.maybe(types.string),
})

export interface IModelInfo extends Instance<typeof ModelInfoModel> {}

export interface ILLMStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  models: IModelInfo[] & {
    replace(items: IModelInfo[]): void
  }
  selectedModelKey: string | null
  updateModelProgress(modelKey: string, progress: number): void
}

// Views
const withViews = (self: ILLMStore) => ({
  get selectedModel() {
    return self.selectedModelKey 
      ? self.models.find((m: IModelInfo) => m.key === self.selectedModelKey) ?? null
      : null
  },
  
  get downloadingModel() {
    return self.models.find((m: IModelInfo) => m.status === "downloading") ?? null
  },
  
  get hasReadyModel() {
    return self.models.some((m: IModelInfo) => m.status === "ready")
  }
})

// Store Model
export const LLMStoreModel = types
  .model("LLMStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    models: types.array(ModelInfoModel),
    selectedModelKey: types.maybeNull(types.string),
  })
  .actions((self) => ({
    updateModelProgress(modelKey: string, progress: number) {
      const modelIndex = self.models.findIndex((m) => m.key === modelKey)
      if (modelIndex !== -1) {
        self.models[modelIndex].progress = progress
      }
    }
  }))
  .actions(withSetPropAction)
  .actions(withInitialize)
  .actions(withStartModelDownload)
  .actions(withCancelModelDownload)
  .actions(withDeleteModel)
  .actions(withSelectModel)
  .views(withViews)

export interface LLMStore extends Instance<typeof LLMStoreModel> {}
export interface LLMStoreSnapshotOut extends SnapshotOut<typeof LLMStoreModel> {}
export interface LLMStoreSnapshotIn extends SnapshotIn<typeof LLMStoreModel> {}

export const createLLMStoreDefaultModel = () =>
  LLMStoreModel.create({
    isInitialized: false,
    error: null,
    models: [],
    selectedModelKey: null,
  })
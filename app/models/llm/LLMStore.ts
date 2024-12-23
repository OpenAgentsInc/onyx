import {
  Instance, IStateTreeNode, SnapshotIn, SnapshotOut, types
} from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { withCancelModelDownload } from "./actions/cancel-model-download"
import { withDeleteModel } from "./actions/delete-model"
import { withInitialize } from "./actions/initialize"
import { withSelectModel } from "./actions/select-model"
import { withStartModelDownload } from "./actions/start-model-download"
import { LocalModelService } from "@/services/local-models/LocalModelService"

// Types
export const ModelInfoModel = types.model("ModelInfo", {
  key: types.string,
  displayName: types.string,
  path: types.maybeNull(types.string),
  status: types.enumeration(["idle", "downloading", "initializing", "ready", "error"]),
  progress: types.number,
  error: types.maybe(types.string),
})

export interface IModelInfo extends Instance<typeof ModelInfoModel> { }

export interface ILLMStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  models: IModelInfo[] & {
    replace(items: IModelInfo[]): void
  }
  selectedModelKey: string | null
  updateModelProgress(modelKey: string, progress: number): void
  localModelService: LocalModelService
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
  .volatile(self => ({
    localModelService: new LocalModelService()
  }))
  .actions((self) => ({
    updateModelProgress(modelKey: string, progress: number) {
      const modelIndex = self.models.findIndex((m) => m.key === modelKey)
      if (modelIndex !== -1 && self.models[modelIndex].status === "downloading") {
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

export interface LLMStore extends Instance<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotOut extends SnapshotOut<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotIn extends SnapshotIn<typeof LLMStoreModel> { }

export const createLLMStoreDefaultModel = () =>
  LLMStoreModel.create({
    isInitialized: false,
    error: null,
    models: [],
    selectedModelKey: null,
  })
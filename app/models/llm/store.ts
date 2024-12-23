import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { withInitialize } from "./actions/initialize"
import { withModelManagement } from "./actions/model-management"
import { ModelInfoModel } from "./types"
import { withViews } from "./views"

const LLMStoreModel = types
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
  .actions(withModelManagement)
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

export { LLMStoreModel }
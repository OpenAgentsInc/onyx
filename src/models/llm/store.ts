import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { withInitialize } from "./actions/initialize"
import { withModelManagement } from "./actions/model-management"
import { ModelInfoModel } from "./types"
import { withViews } from "./views"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"

const LLMStoreModel = types
  .model("LLMStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    models: types.array(ModelInfoModel),
    selectedModelKey: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions(withInitialize)
  .actions(withModelManagement)
  .views(withViews)

export interface LLMStore extends Instance<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotOut extends SnapshotOut<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotIn extends SnapshotIn<typeof LLMStoreModel> { }

export const createLLMStoreDefaultModel = () => {
  // Initialize models array from available models
  const initialModels = Object.entries(AVAILABLE_MODELS).map(([key, model]) => ({
    key,
    displayName: model.displayName,
    path: null,
    status: "idle",
    progress: 0,
    error: undefined
  }))

  return LLMStoreModel.create({
    isInitialized: false,
    error: null,
    models: initialModels,
    selectedModelKey: null,
  })
}

export { LLMStoreModel }
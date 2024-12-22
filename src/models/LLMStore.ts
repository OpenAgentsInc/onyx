import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { LocalModelService } from "@/services/local-models/LocalModelService"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const LLMStoreModel = types
  .model("LLMStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => {
    const setError = (message: string | null) => {
      // console.log("[WalletStore] Setting error:", message)
      self.error = message
    }

    const initialize = flow(function* () {
      console.tron.display({
        name: 'Initialize',
        value: 'placeholder'
      })

      // See if we have any models loaded locally (first set checking)
      const localModelService = new LocalModelService()
      const models = yield localModelService.getLocalModels()
      console.tron.display({
        name: 'Local Models',
        value: models
      })
    })

    return {
      setError,
      initialize,
    }
  })

export interface LLMStore extends Instance<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotOut extends SnapshotOut<typeof LLMStoreModel> { }
export interface LLMStoreSnapshotIn extends SnapshotIn<typeof LLMStoreModel> { }

export const createWalletStoreDefaultModel = () =>
  LLMStoreModel.create({
    isInitialized: false,
    error: null,
  })

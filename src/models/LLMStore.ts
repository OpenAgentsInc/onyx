import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
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

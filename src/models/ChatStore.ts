import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { log } from "@/utils/log"
import { withSetPropAction } from "./helpers/withSetPropAction"

const MessageModel = types.model("Message", {
  id: types.string,
  amount: types.number,
  timestamp: types.number,
  role: types.enumeration(["user", "assistant", "system"]),
})


export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => {
    const setup = () => {
      log({ name: "[ChatStore] Setting up" })
    }
    return {
      setup
    }
  })

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

export const createWalletStoreDefaultModel = () =>
  ChatStoreModel.create({
    isInitialized: false,
    error: null,
  })

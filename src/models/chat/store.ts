import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { withInitialize } from "./actions/initialize"
import { withContextManagement } from "./actions/context-management"
import { withMessageManagement } from "./actions/message-management"
import { ChatContextModel, MessageModel } from "./types"
import { withViews } from "./views"

export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    contexts: types.array(ChatContextModel),
    messages: types.array(MessageModel),
    activeModelKey: types.maybeNull(types.string),
    inferencing: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions(withInitialize)
  .actions(withContextManagement)
  .actions(withMessageManagement)
  .views(withViews)

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

export const createChatStoreDefaultModel = () =>
  ChatStoreModel.create({
    isInitialized: false,
    error: null,
    contexts: [],
    messages: [],
    activeModelKey: null,
    inferencing: false,
  })

export { ChatStoreModel }
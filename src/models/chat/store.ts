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
  .actions((self) => ({
    // Basic actions
    setError(error: string | null) {
      self.error = error
    },
    setInferencing(value: boolean) {
      self.inferencing = value
    },
    setActiveModel(modelKey: string | null) {
      self.activeModelKey = modelKey
    },
    // Message actions
    addMessage(message: {
      text: string
      role: "user" | "assistant" | "system"
      metadata?: {
        contextId?: string
        conversationId?: string
        timings?: string
        system?: boolean
        copyable?: boolean
      }
    }) {
      const id = Math.random().toString(36).substring(2, 9)
      const timestamp = Date.now()
      self.messages.push({ id, timestamp, ...message })
      return id
    },
    // Context actions
    addContext(id: string, modelKey: string) {
      self.contexts.push({
        id,
        modelKey,
        isLoaded: false,
        gpu: false,
        reasonNoGPU: "",
        sessionPath: undefined,
      })
    },
  }))
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
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { log } from "@/utils/log"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model information type
 */
const ModelInfoModel = types.model("ModelInfo", {
  id: types.identifier,
  name: types.string,
  size: types.number,
  numParams: types.number,
  contextLength: types.number,
  isChatTemplateSupported: types.optional(types.boolean, false),
  gpuLayers: types.optional(types.number, 0),
  temperature: types.optional(types.number, 0.7),
  topK: types.optional(types.number, 40),
  topP: types.optional(types.number, 0.5),
  minP: types.optional(types.number, 0.05),
})

/**
 * Message model with enhanced metadata
 */
const MessageModel = types.model("Message", {
  id: types.string,
  text: types.string,
  timestamp: types.number,
  role: types.enumeration(["user", "assistant", "system"]),
  metadata: types.optional(types.model({
    contextId: types.maybe(types.string),
    conversationId: types.maybe(types.string),
    timings: types.maybe(types.string),
    system: types.optional(types.boolean, false),
    copyable: types.optional(types.boolean, false),
  }), {})
})

/**
 * Model context state
 */
const ModelContextModel = types.model("ModelContext", {
  id: types.identifier,
  modelId: types.reference(ModelInfoModel),
  isLoaded: types.boolean,
  gpu: types.optional(types.boolean, false),
  reasonNoGPU: types.optional(types.string, ""),
  sessionPath: types.maybe(types.string),
})

/**
 * Main chat store model
 */
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    models: types.array(ModelInfoModel),
    activeModelId: types.maybe(types.reference(ModelInfoModel)),
    contexts: types.array(ModelContextModel),
    messages: types.array(MessageModel),
    inferencing: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get activeModel() {
      return self.activeModelId
    },
    get activeContext() {
      if (!self.activeModelId) return null
      return self.contexts.find(ctx => ctx.modelId === self.activeModelId) || null
    },
    get conversationMessages() {
      // Return messages sorted by timestamp
      return [...self.messages].sort((a, b) => b.timestamp - a.timestamp)
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => ({
    setup() {
      log({ name: "[ChatStore] Setting up" })
      self.isInitialized = true
    },
    reset() {
      self.messages.clear()
      self.error = null
      self.inferencing = false
    },
    setError(error: string | null) {
      self.error = error
    },
    clearError() {
      self.error = null
    },
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

export const createChatStoreDefaultModel = () =>
  ChatStoreModel.create({
    isInitialized: false,
    error: null,
    models: [],
    contexts: [],
    messages: [],
    inferencing: false,
  })
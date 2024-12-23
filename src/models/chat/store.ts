import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { withInitialize } from "./actions/initialize"
import { withContextManagement } from "./actions/context-management"
import { withMessageManagement } from "./actions/message-management"
import { MessageModel } from "./types"
import { withViews } from "./views"
import type { LlamaContext } from "llama.rn"

// Create a volatile state for the llama context
const withVolatileContext = (self: any) => ({
  volatileContexts: new Map<string, LlamaContext>(),
})

export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    messages: types.array(MessageModel),
    activeModelKey: types.maybeNull(types.string),
    inferencing: types.optional(types.boolean, false),
  })
  .volatile(withVolatileContext)
  .actions(withSetPropAction)
  .actions((self: any) => ({
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
    // Context management
    addContext(context: LlamaContext & { modelKey: string }) {
      self.volatileContexts.set(context.id, context)
    },
    removeContext(contextId: string) {
      self.volatileContexts.delete(contextId)
    },
    getContext(contextId: string): LlamaContext | undefined {
      return self.volatileContexts.get(contextId)
    },
    get contexts(): LlamaContext[] {
      return Array.from(self.volatileContexts.values())
    }
  }))
  .actions(withInitialize)
  .actions(withContextManagement)
  .actions(withMessageManagement)
  .views(withViews)

export interface ChatStore extends Instance<typeof ChatStoreModel> {
  // Expose the initializeContext method in the interface
  initializeContext: (
    id: string,
    modelPath: string,
    loraPath?: string | null,
    onProgress?: (progress: number) => void
  ) => Promise<LlamaContext>
}

export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

export const createChatStoreDefaultModel = () =>
  ChatStoreModel.create({
    isInitialized: false,
    error: null,
    messages: [],
    activeModelKey: null,
    inferencing: false,
  })

export { ChatStoreModel }
import { Instance, IStateTreeNode, types } from "mobx-state-tree"
import type { LlamaContext } from "llama.rn"

/**
 * Message model with enhanced metadata
 */
export const MessageModel = types.model("Message", {
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
export const ChatContextModel = types.model("ChatContext", {
  id: types.identifier,
  modelKey: types.string,
  isLoaded: types.boolean,
  gpu: types.optional(types.boolean, false),
  reasonNoGPU: types.optional(types.string, ""),
  sessionPath: types.optional(types.maybeNull(types.string), undefined),
})

export interface IMessage extends Instance<typeof MessageModel> {}

// Extend ChatContext to include llama.rn methods
export interface IChatContext extends Instance<typeof ChatContextModel>, Omit<LlamaContext, keyof Instance<typeof ChatContextModel>> {}

// Base store interface
export interface IChatStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  contexts: IChatContext[] & {
    replace(items: IChatContext[]): void
  }
  messages: IMessage[] & {
    replace(items: IMessage[]): void
  }
  activeModelKey: string | null
  inferencing: boolean
}
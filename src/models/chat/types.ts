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

export interface IMessage extends Instance<typeof MessageModel> {}

// Base store interface
export interface IChatStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  messages: IMessage[] & {
    replace(items: IMessage[]): void
  }
  activeModelKey: string | null
  inferencing: boolean
  // Context management
  addContext(context: LlamaContext & { modelKey: string }): void
  removeContext(contextId: string): void
  getContext(contextId: string): LlamaContext | undefined
  contexts: LlamaContext[]
  volatileContexts: Map<string, LlamaContext>
}
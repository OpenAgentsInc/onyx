import { IChatStore, IMessage } from "./types"

export const withViews = (self: IChatStore) => ({
  get activeContext() {
    if (!self.activeModelKey) return null
    return self.contexts.find(ctx => ctx.modelKey === self.activeModelKey) || null
  },

  get conversationMessages() {
    // Return messages sorted by timestamp
    return [...self.messages].sort((a: IMessage, b: IMessage) => b.timestamp - a.timestamp)
  },

  get hasActiveContext() {
    return !!this.activeContext
  },

  get isContextLoaded() {
    const context = this.activeContext
    return context ? context.isLoaded : false
  },

  get gpuAvailable() {
    const context = this.activeContext
    return context ? context.gpu : false
  }
})
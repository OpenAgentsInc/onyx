import { Instance } from "mobx-state-tree"
import { ChatStoreModel } from "./store"

export const withViews = (self: Instance<typeof ChatStoreModel>) => ({
  get activeContext() {
    if (!self.activeModelKey) return null
    return self.contexts.find(ctx => ctx.modelKey === self.activeModelKey) || null
  },

  get conversationMessages() {
    // Return messages sorted by timestamp
    return self.messages
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
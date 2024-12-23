import { IChatStore } from "../types"
import { log } from "@/utils/log"

export const withInitialize = (self: IChatStore) => ({
  setup() {
    log({ 
      name: "[ChatStore] Setting up",
      value: {
        isInitialized: self.isInitialized,
        activeModelKey: self.activeModelKey,
        contexts: self.contexts.length
      }
    })
    self.isInitialized = true
  },

  reset() {
    self.messages.replace([])
    self.error = null
    self.inferencing = false
    // Clear all contexts
    self.contexts.forEach(ctx => {
      try {
        ctx.release()
      } catch (e) {
        log({
          name: "[ChatStore] Error releasing context during reset",
          value: e
        })
      }
    })
    // Clear volatile state
    self.volatileContexts.clear()
  },

  setError(error: string | null) {
    self.error = error
  },

  clearError() {
    self.error = null
  }
})
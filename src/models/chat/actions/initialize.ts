import { IChatStore } from "../types"
import { log } from "@/utils/log"

export const withInitialize = (self: IChatStore) => ({
  setup() {
    log({ name: "[ChatStore] Setting up" })
    self.isInitialized = true
  },

  reset() {
    self.messages.replace([])
    self.error = null
    self.inferencing = false
  },

  setError(error: string | null) {
    self.error = error
  },

  clearError() {
    self.error = null
  }
})
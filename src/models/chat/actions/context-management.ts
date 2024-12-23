import { IChatStore } from "../types"

export const withContextManagement = (self: IChatStore) => ({
  setActiveModel(modelKey: string | null) {
    self.activeModelKey = modelKey
  },

  addContext(
    id: string,
    modelKey: string,
    gpu: boolean = false,
    reasonNoGPU: string = "",
  ) {
    self.contexts.push({
      id,
      modelKey,
      isLoaded: false,
      gpu,
      reasonNoGPU,
      sessionPath: null,
    })
  },

  setContextLoaded(contextId: string, loaded: boolean = true) {
    const context = self.contexts.find(ctx => ctx.id === contextId)
    if (context) {
      context.isLoaded = loaded
    }
  },

  setContextSession(contextId: string, sessionPath: string | null) {
    const context = self.contexts.find(ctx => ctx.id === contextId)
    if (context) {
      context.sessionPath = sessionPath
    }
  },

  removeContext(contextId: string) {
    const index = self.contexts.findIndex(ctx => ctx.id === contextId)
    if (index >= 0) {
      self.contexts.splice(index, 1)
    }
  }
})
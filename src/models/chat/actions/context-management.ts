import { IChatStore } from "../types"
import { initLlama } from "llama.rn"
import { Platform } from "react-native"
import { log } from "@/utils/log"

export const withContextManagement = (self: IChatStore) => ({
  setActiveModel(modelKey: string | null) {
    self.activeModelKey = modelKey
  },

  async addContext(
    id: string,
    modelKey: string,
    modelPath: string,
    onProgress?: (progress: number) => void
  ) {
    try {
      // Initialize llama context
      const context = await initLlama(
        {
          model: modelPath,
          use_mlock: true,
          n_gpu_layers: Platform.OS === "ios" ? 99 : 0, // Enable GPU on iOS
        },
        onProgress
      )

      // Add context to store
      self.contexts.push({
        id,
        modelKey,
        isLoaded: true,
        gpu: context.gpu,
        reasonNoGPU: context.reasonNoGPU || "",
        sessionPath: null,
        ...context // Spread llama.rn context methods
      })

      log({
        name: "[ChatStore] Context initialized",
        data: {
          id,
          modelKey,
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU
        }
      })

    } catch (error) {
      log({
        name: "[ChatStore] Context initialization failed",
        data: error
      })
      throw error
    }
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

  async removeContext(contextId: string) {
    const context = self.contexts.find(ctx => ctx.id === contextId)
    if (context) {
      try {
        // Release llama context
        await context.release()
      } catch (error) {
        log({
          name: "[ChatStore] Context release failed",
          data: error
        })
      }
      // Remove from store
      const index = self.contexts.findIndex(ctx => ctx.id === contextId)
      if (index >= 0) {
        self.contexts.splice(index, 1)
      }
    }
  }
})
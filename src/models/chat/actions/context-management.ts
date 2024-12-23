import { Platform } from "react-native"
import { initLlama } from "llama.rn"
import { IChatStore } from "../types"
import { log } from "@/utils/log"

export const withContextManagement = (self: IChatStore) => ({
  setActiveModel(modelKey: string | null) {
    self.activeModelKey = modelKey
  },

  async initializeContext(
    id: string,
    modelPath: string,
    loraPath?: string | null,
    onProgress?: (progress: number) => void
  ) {
    try {
      // Initialize llama context
      const context = await initLlama(
        {
          model: modelPath,
          use_mlock: true,
          n_gpu_layers: Platform.OS === "ios" ? 99 : 0, // Enable GPU on iOS
          lora_list: loraPath ? [{ path: loraPath, scaled: 1.0 }] : undefined,
        },
        (progress) => {
          onProgress?.(progress)
          log({
            name: "[ChatStore] Model loading progress",
            data: { progress }
          })
        }
      )

      // Add context to store
      self.contexts.push({
        id,
        modelKey: modelPath,
        isLoaded: true,
        gpu: context.gpu,
        reasonNoGPU: context.reasonNoGPU || "",
        sessionPath: null,
        ...context // Spread llama.rn context methods
      })

      // Set as active model
      self.setActiveModel(modelPath)

      log({
        name: "[ChatStore] Context initialized",
        data: {
          id,
          modelPath,
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU
        }
      })

    } catch (error) {
      log({
        name: "[ChatStore] Context initialization failed",
        data: { error }
      })
      throw error
    }
  },

  async releaseContext(contextId: string) {
    const context = self.contexts.find(ctx => ctx.id === contextId)
    if (context) {
      try {
        // Release llama context
        await context.release()
        
        // Remove from store
        self.contexts.splice(self.contexts.indexOf(context), 1)

        // Clear active model if this was it
        if (self.activeModelKey === context.modelKey) {
          self.setActiveModel(null)
        }

        log({
          name: "[ChatStore] Context released",
          data: { contextId }
        })
      } catch (error) {
        log({
          name: "[ChatStore] Context release failed",
          data: { error }
        })
        throw error
      }
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

  removeContext(contextId: string) {
    const index = self.contexts.findIndex(ctx => ctx.id === contextId)
    if (index >= 0) {
      // Release context first
      this.releaseContext(contextId).catch(error => {
        log({
          name: "[ChatStore] Error releasing context during removal",
          data: { error }
        })
      })
      // Remove from store
      self.contexts.splice(index, 1)
    }
  }
})
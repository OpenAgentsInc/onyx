import { Platform } from "react-native"
import { initLlama } from "llama.rn"
import { IChatStore } from "../types"
import { log } from "@/utils/log"
import { flow } from "mobx-state-tree"

export const withContextManagement = (self: IChatStore) => ({
  setActiveModel(modelKey: string | null) {
    self.activeModelKey = modelKey
  },

  initializeContext: flow(function* (
    id: string,
    modelPath: string,
    loraPath?: string | null,
    onProgress?: (progress: number) => void
  ) {
    try {
      // Initialize llama context
      const context = yield initLlama(
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
            value: { progress }
          })
        }
      )

      // Add context to store using action
      const contextData = {
        id,
        modelKey: modelPath,
        isLoaded: true,
        gpu: context.gpu,
        reasonNoGPU: context.reasonNoGPU || "",
        sessionPath: null,
        ...context // Spread llama.rn context methods
      }
      
      self.contexts.push(contextData)

      // Set as active model
      self.setActiveModel(modelPath)

      log({
        name: "[ChatStore] Context initialized",
        value: {
          id,
          modelPath,
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU
        }
      })

      return contextData

    } catch (error) {
      log({
        name: "[ChatStore] Context initialization failed",
        value: error
      })
      throw error
    }
  }),

  releaseContext: flow(function* (contextId: string) {
    const context = self.contexts.find(ctx => ctx.id === contextId)
    if (context) {
      try {
        // Release llama context
        yield context.release()
        
        // Remove from store using action
        const index = self.contexts.findIndex(ctx => ctx.id === contextId)
        if (index >= 0) {
          self.contexts.splice(index, 1)
        }

        // Clear active model if this was it
        if (self.activeModelKey === context.modelKey) {
          self.setActiveModel(null)
        }

        log({
          name: "[ChatStore] Context released",
          value: { contextId }
        })
      } catch (error) {
        log({
          name: "[ChatStore] Context release failed",
          value: error
        })
        throw error
      }
    }
  }),

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

  removeContext: flow(function* (contextId: string) {
    const index = self.contexts.findIndex(ctx => ctx.id === contextId)
    if (index >= 0) {
      try {
        // Release context first
        yield self.releaseContext(contextId)
        // Remove from store using action
        self.contexts.splice(index, 1)
      } catch (error) {
        log({
          name: "[ChatStore] Error releasing context during removal",
          value: error
        })
      }
    }
  })
})
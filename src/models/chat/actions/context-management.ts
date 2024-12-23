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
      log({
        name: "[ChatStore] Starting context initialization",
        value: {
          id,
          modelPath,
          loraPath
        }
      })

      // Initialize llama context
      log({
        name: "[ChatStore] Calling initLlama",
        value: {
          model: modelPath,
          use_mlock: true,
          n_gpu_layers: Platform.OS === "ios" ? 99 : 0,
          lora_list: loraPath ? [{ path: loraPath, scaled: 1.0 }] : undefined,
        }
      })

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

      log({
        name: "[ChatStore] initLlama completed",
        value: {
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU,
          contextMethods: Object.keys(context),
          completion: context.completion,
          completionType: typeof context.completion
        }
      })

      // Store the context directly
      self.contexts.push(context)

      // Set as active model
      self.setActiveModel(modelPath)

      log({
        name: "[ChatStore] Context initialized successfully",
        value: {
          id,
          modelPath,
          gpu: context.gpu,
          reasonNoGPU: context.reasonNoGPU,
          activeModel: self.activeModelKey,
          contextsCount: self.contexts.length,
          context: self.contexts[self.contexts.length - 1],
          completion: self.contexts[self.contexts.length - 1].completion,
          completionType: typeof self.contexts[self.contexts.length - 1].completion
        },
        important: true
      })

      return context

    } catch (error) {
      log({
        name: "[ChatStore] Context initialization failed",
        value: {
          error,
          errorMessage: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
          id,
          modelPath
        },
        important: true
      })
      throw error
    }
  }),

  releaseContext: flow(function* (contextId: string) {
    const context = self.contexts.find(ctx => ctx.id === contextId)
    if (context) {
      try {
        log({
          name: "[ChatStore] Starting context release",
          value: { contextId }
        })

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
          name: "[ChatStore] Context released successfully",
          value: { 
            contextId,
            remainingContexts: self.contexts.length,
            activeModel: self.activeModelKey
          }
        })
      } catch (error) {
        log({
          name: "[ChatStore] Context release failed",
          value: {
            error,
            contextId,
            errorMessage: error instanceof Error ? error.message : String(error)
          },
          important: true
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
        log({
          name: "[ChatStore] Starting context removal",
          value: { contextId }
        })

        // Release context first
        yield self.releaseContext(contextId)
        // Remove from store using action
        self.contexts.splice(index, 1)

        log({
          name: "[ChatStore] Context removed successfully",
          value: { 
            contextId,
            remainingContexts: self.contexts.length
          }
        })
      } catch (error) {
        log({
          name: "[ChatStore] Error during context removal",
          value: {
            error,
            contextId,
            errorMessage: error instanceof Error ? error.message : String(error)
          },
          important: true
        })
      }
    }
  })
})
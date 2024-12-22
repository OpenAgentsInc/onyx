import { flow } from "mobx-state-tree"
import { log } from "@/utils/log"
import { ILLMStore, IModelInfo } from "../types"
import * as FileSystem from "expo-file-system"

const MODELS_DIR = `${FileSystem.cacheDirectory}models`

export const withInitialize = (self: ILLMStore) => {
  return {
    initialize: flow(function* () {
      try {
        log.debug("[LLMStore] Starting initialization")

        // Ensure models directory exists
        yield FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true })

        // Check each model's file
        for (const model of self.models) {
          if (model.path) {
            const fileInfo = yield FileSystem.getInfoAsync(model.path)
            if (!fileInfo.exists) {
              model.path = null
              model.status = "idle"
            } else {
              model.status = "ready"
            }
          }
        }

        self.isInitialized = true
        self.error = null
        log.debug("[LLMStore] Initialization complete")
      } catch (error) {
        log.error("[LLMStore] Initialization error:", error)
        self.error = error instanceof Error ? error.message : "Failed to initialize"
        throw error
      }
    })
  }
}
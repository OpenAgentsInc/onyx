import { flow } from "mobx-state-tree"
import { log } from "@/utils/log"
import { ILLMStore } from "../types"
import * as FileSystem from "expo-file-system"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"

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
          const modelConfig = AVAILABLE_MODELS[model.key]
          if (!modelConfig) continue
          
          const modelPath = `${MODELS_DIR}/${modelConfig.filename}`
          const fileInfo = yield FileSystem.getInfoAsync(modelPath)
          if (fileInfo.exists) {
            model.path = modelPath
            model.status = "ready"
          }
        }

        // If we have a ready model, select it
        const readyModel = self.models.find(m => m.status === "ready")
        if (readyModel) {
          self.selectedModelKey = readyModel.key
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
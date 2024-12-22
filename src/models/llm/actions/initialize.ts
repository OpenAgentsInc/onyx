import { flow } from "mobx-state-tree"
import { log } from "@/utils/log"
import { ILLMStore, IModelInfo } from "../types"
import * as FileSystem from "expo-file-system"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"
import { ModelInfoModel } from "../types"

const MODELS_DIR = `${FileSystem.cacheDirectory}models`

export const withInitialize = (self: ILLMStore) => {
  return {
    initialize: flow(function* () {
      try {
        log.debug("[LLMStore] Starting initialization")

        // Ensure models directory exists
        yield FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true })

        // Initialize models array from available models
        const models = Object.entries(AVAILABLE_MODELS).map(([key, model]) => {
          const modelPath = `${MODELS_DIR}/${key}`
          return ModelInfoModel.create({
            key,
            displayName: model.displayName,
            path: null, // Will check existence below
            status: "idle",
            progress: 0,
            error: undefined
          })
        })

        // Replace models in store
        self.models.replace(models)

        // Check each model's file
        for (const model of self.models) {
          const modelPath = `${MODELS_DIR}/${model.key}`
          const fileInfo = yield FileSystem.getInfoAsync(modelPath)
          if (fileInfo.exists) {
            model.path = modelPath
            model.status = "ready"
          }
        }

        // If we have a ready model, select it
        const readyModel = self.models.find((m: IModelInfo) => m.status === "ready")
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
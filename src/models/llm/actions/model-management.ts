import { flow } from "mobx-state-tree"
import { LocalModelService } from "@/services/local-models/LocalModelService"
import { ILLMStore, IModelInfo } from "../types"
import * as FileSystem from "expo-file-system"

const MODELS_DIR = `${FileSystem.cacheDirectory}models`

export const withModelManagement = (self: ILLMStore) => {
  const localModelService = new LocalModelService()
  let downloadResumable: FileSystem.DownloadResumable | null = null

  const cleanupTempFile = async (tempPath: string) => {
    try {
      const tempFileInfo = await FileSystem.getInfoAsync(tempPath)
      if (tempFileInfo.exists) {
        await FileSystem.deleteAsync(tempPath)
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temp file:", cleanupError)
    }
  }

  return {
    startModelDownload: flow(function* (modelKey: string) {
      try {
        // Find model in store
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex === -1) {
          throw new Error("Model not found")
        }

        // Update status
        self.models[modelIndex].status = "downloading"
        self.models[modelIndex].error = undefined

        // Create temp path
        const model = self.models[modelIndex]
        const tempPath = `${FileSystem.cacheDirectory}temp_${model.key}`
        const finalPath = `${MODELS_DIR}/${model.key}`

        // Ensure directory exists
        yield FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true })

        // Start download
        downloadResumable = FileSystem.createDownloadResumable(
          `https://huggingface.co/${model.key}/resolve/main/${model.key}`,
          tempPath,
          {},
          (downloadProgress) => {
            const progress = parseFloat(
              ((downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100)
              .toFixed(1)
            )
            // Only update if still downloading
            if (self.models[modelIndex].status === "downloading") {
              self.models[modelIndex].progress = progress
            }
          }
        )

        const result = yield downloadResumable.downloadAsync()
        
        // If download was cancelled or failed
        if (!result?.uri) {
          yield cleanupTempFile(tempPath)
          return
        }

        // Validate file
        const fileInfo = yield FileSystem.getInfoAsync(result.uri)
        if (!fileInfo.exists || fileInfo.size < 100 * 1024 * 1024) {
          yield cleanupTempFile(tempPath)
          throw new Error("Downloaded file is invalid or too small")
        }

        // Move to final location
        yield FileSystem.moveAsync({
          from: result.uri,
          to: finalPath
        })

        // Update model info
        self.models[modelIndex].path = finalPath
        self.models[modelIndex].status = "ready"
        self.models[modelIndex].progress = 100

        // Select this model if none selected
        if (!self.selectedModelKey) {
          self.selectedModelKey = modelKey
        }

        self.error = null
        downloadResumable = null

      } catch (error) {
        console.error("[LLMStore] Download error:", error)
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "error"
          self.models[modelIndex].error = error instanceof Error ? error.message : "Download failed"
        }
        self.error = error instanceof Error ? error.message : "Failed to download model"
      }
    }),

    cancelModelDownload: flow(function* (modelKey: string) {
      try {
        if (downloadResumable) {
          yield downloadResumable.cancelAsync()
          downloadResumable = null
        }
        
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          const tempPath = `${FileSystem.cacheDirectory}temp_${modelKey}`
          yield cleanupTempFile(tempPath)
          
          self.models[modelIndex].status = "idle"
          self.models[modelIndex].progress = 0
          self.models[modelIndex].error = undefined
        }
        
        self.error = null
      } catch (error) {
        console.error("[LLMStore] Cancel download error:", error)
        self.error = error instanceof Error ? error.message : "Failed to cancel download"
      }
    }),

    deleteModel: flow(function* (modelKey: string) {
      try {
        yield localModelService.deleteModel(modelKey)
        
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          self.models[modelIndex].status = "idle"
          self.models[modelIndex].path = null
          self.models[modelIndex].progress = 0
          self.models[modelIndex].error = undefined
        }

        // If this was the selected model, clear selection
        if (self.selectedModelKey === modelKey) {
          self.selectedModelKey = null
        }
        
        self.error = null
      } catch (error) {
        console.error("[LLMStore] Delete model error:", error)
        self.error = error instanceof Error ? error.message : "Failed to delete model"
      }
    }),

    selectModel(modelKey: string | null) {
      self.selectedModelKey = modelKey
    }
  }
}
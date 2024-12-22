import { flow, getType } from "mobx-state-tree"
import { ILLMStore, IModelInfo } from "../types"
import * as FileSystem from "expo-file-system"

const MODELS_DIR = `${FileSystem.cacheDirectory}models`

export const withModelManagement = (self: ILLMStore) => {
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

  const setModelStatus = (modelIndex: number, status: string) => {
    const model = self.models[modelIndex]
    const ModelType = getType(model)
    ModelType.actions(m => ({
      setStatus() {
        m.status = status
      }
    })).call(model)
  }

  const setModelProgress = (modelIndex: number, progress: number) => {
    const model = self.models[modelIndex]
    const ModelType = getType(model)
    ModelType.actions(m => ({
      setProgress() {
        m.progress = progress
      }
    })).call(model)
  }

  const setModelError = (modelIndex: number, error: string | undefined) => {
    const model = self.models[modelIndex]
    const ModelType = getType(model)
    ModelType.actions(m => ({
      setError() {
        m.error = error
      }
    })).call(model)
  }

  const setModelPath = (modelIndex: number, path: string | null) => {
    const model = self.models[modelIndex]
    const ModelType = getType(model)
    ModelType.actions(m => ({
      setPath() {
        m.path = path
      }
    })).call(model)
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
        setModelStatus(modelIndex, "downloading")
        setModelError(modelIndex, undefined)

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
              setModelProgress(modelIndex, progress)
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
        setModelPath(modelIndex, finalPath)
        setModelStatus(modelIndex, "ready")
        setModelProgress(modelIndex, 100)

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
          setModelStatus(modelIndex, "error")
          setModelError(modelIndex, error instanceof Error ? error.message : "Download failed")
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
          
          setModelStatus(modelIndex, "idle")
          setModelProgress(modelIndex, 0)
          setModelError(modelIndex, undefined)
        }
        
        self.error = null
      } catch (error) {
        console.error("[LLMStore] Cancel download error:", error)
        self.error = error instanceof Error ? error.message : "Failed to cancel download"
      }
    }),

    deleteModel: flow(function* (modelKey: string) {
      try {
        const modelIndex = self.models.findIndex((m: IModelInfo) => m.key === modelKey)
        if (modelIndex !== -1) {
          const model = self.models[modelIndex]
          if (model.path) {
            yield FileSystem.deleteAsync(model.path, { idempotent: true })
          }
          
          setModelStatus(modelIndex, "idle")
          setModelPath(modelIndex, null)
          setModelProgress(modelIndex, 0)
          setModelError(modelIndex, undefined)
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
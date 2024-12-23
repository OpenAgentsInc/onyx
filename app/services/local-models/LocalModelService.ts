import * as FileSystem from "expo-file-system"
import { AppState } from "react-native"
import { AVAILABLE_MODELS } from "./constants"

const MODELS_DIR = `${FileSystem.cacheDirectory}models`

export interface ModelInfo {
  key: string
  displayName: string
  path: string | null
  status: "idle" | "downloading" | "initializing" | "ready" | "error"
  progress: number
  error?: string
}

export class LocalModelService {
  private downloadResumable: FileSystem.DownloadResumable | null = null
  private currentTempPath: string | null = null

  constructor() {
    // Ensure models directory exists
    FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true }).catch(console.error)

    // Handle app state changes
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" && this.downloadResumable) {
        this.cancelDownload()
      }
    })
  }

  async getLocalModels(): Promise<ModelInfo[]> {
    const models: ModelInfo[] = []

    for (const [key, model] of Object.entries(AVAILABLE_MODELS)) {
      const path = `${MODELS_DIR}/${model.filename}`
      const fileInfo = await FileSystem.getInfoAsync(path)

      models.push({
        key,
        displayName: model.displayName,
        path: fileInfo.exists ? path : null,
        status: fileInfo.exists ? "ready" : "idle",
        progress: 0
      })
    }

    return models
  }

  async startDownload(modelKey: string, onProgress?: (progress: number) => void): Promise<string> {
    const model = AVAILABLE_MODELS[modelKey]
    if (!model) {
      throw new Error("Invalid model selected")
    }

    // Store temp path so we can clean it up if cancelled
    this.currentTempPath = `${FileSystem.cacheDirectory}temp_${model.filename}`
    const finalPath = `${MODELS_DIR}/${model.filename}`

    // Create download
    this.downloadResumable = FileSystem.createDownloadResumable(
      `https://huggingface.co/${model.repoId}/resolve/main/${model.filename}`,
      this.currentTempPath,
      {},
      (downloadProgress) => {
        const progress =
          (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
        onProgress?.(progress)
      }
    )

    try {
      // Start download
      const result = await this.downloadResumable.downloadAsync()
      if (!result?.uri) {
        throw new Error("Download failed - no URI received")
      }

      // Validate file
      const fileInfo = await FileSystem.getInfoAsync(result.uri)
      if (!fileInfo.exists || fileInfo.size < 100 * 1024 * 1024) {
        throw new Error("Downloaded file is invalid or too small")
      }

      // Move to final location
      await FileSystem.moveAsync({
        from: result.uri,
        to: finalPath
      })

      this.downloadResumable = null
      this.currentTempPath = null
      return finalPath

    } catch (error) {
      // Clean up temp file
      if (this.currentTempPath) {
        try {
          await FileSystem.deleteAsync(this.currentTempPath, { idempotent: true })
        } catch { }
        this.currentTempPath = null
      }

      throw error
    }
  }

  async cancelDownload() {
    if (this.downloadResumable) {
      try {
        await this.downloadResumable.cancelAsync()
        
        // Clean up temp file after cancelling
        if (this.currentTempPath) {
          await FileSystem.deleteAsync(this.currentTempPath, { idempotent: true })
          this.currentTempPath = null
        }
      } catch (error) {
        console.error("Error cancelling download:", error)
      }
      this.downloadResumable = null
    }
  }

  async deleteModel(modelKey: string): Promise<void> {
    const model = AVAILABLE_MODELS[modelKey]
    if (!model) {
      throw new Error("Invalid model selected")
    }

    const path = `${MODELS_DIR}/${model.filename}`
    await FileSystem.deleteAsync(path, { idempotent: true })
  }
}
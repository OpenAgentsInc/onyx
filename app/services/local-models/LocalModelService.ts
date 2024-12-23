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
  private onProgressCallback: ((progress: number) => void) | null = null
  private isCancelled: boolean = false

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
    // Cancel any existing download first
    await this.cancelDownload()
    this.isCancelled = false

    const model = AVAILABLE_MODELS[modelKey]
    if (!model) {
      throw new Error("Invalid model selected")
    }

    // Store temp path and callback so we can clean up if cancelled
    this.currentTempPath = `${FileSystem.cacheDirectory}temp_${model.filename}`
    this.onProgressCallback = onProgress || null
    const finalPath = `${MODELS_DIR}/${model.filename}`

    // Create download
    this.downloadResumable = FileSystem.createDownloadResumable(
      `https://huggingface.co/${model.repoId}/resolve/main/${model.filename}`,
      this.currentTempPath,
      {},
      (downloadProgress) => {
        if (!this.isCancelled) {
          const progress =
            (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
          this.onProgressCallback?.(progress)
        }
      }
    )

    try {
      // Start download
      const result = await this.downloadResumable.downloadAsync()
      if (this.isCancelled) {
        return ""  // Return empty string to indicate cancelled download
      }
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
      this.onProgressCallback = null
      return finalPath

    } catch (error) {
      // If cancelled, don't treat as error
      if (this.isCancelled) {
        return ""
      }

      // Clean up temp file
      if (this.currentTempPath) {
        try {
          await FileSystem.deleteAsync(this.currentTempPath, { idempotent: true })
        } catch { }
        this.currentTempPath = null
      }
      this.downloadResumable = null
      this.onProgressCallback = null

      throw error
    }
  }

  async cancelDownload() {
    if (this.downloadResumable) {
      this.isCancelled = true
      try {
        // Cancel the download first
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
      this.onProgressCallback = null
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
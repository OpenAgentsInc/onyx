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

    const tempPath = `${FileSystem.cacheDirectory}temp_${model.filename}`
    const finalPath = `${MODELS_DIR}/${model.filename}`

    // Create download
    this.downloadResumable = FileSystem.createDownloadResumable(
      `https://huggingface.co/${model.repoId}/resolve/main/${model.filename}`,
      tempPath,
      {},
      (downloadProgress) => {
        const progress =
          (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
        onProgress?.(progress)
      }
    )

    try {
      // Start download
      const { uri } = await this.downloadResumable.downloadAsync()

      // Validate file
      const fileInfo = await FileSystem.getInfoAsync(uri)
      if (!fileInfo.exists || fileInfo.size < 100 * 1024 * 1024) {
        throw new Error("Downloaded file is invalid or too small")
      }

      // Move to final location
      await FileSystem.moveAsync({
        from: uri,
        to: finalPath
      })

      this.downloadResumable = null
      return finalPath

    } catch (error) {
      // Clean up temp file
      try {
        await FileSystem.deleteAsync(tempPath)
      } catch { }

      throw error
    }
  }

  async cancelDownload() {
    if (this.downloadResumable) {
      try {
        await this.downloadResumable.cancelAsync()
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

import ReactNativeBlobUtil from 'react-native-blob-util'
import { Platform } from 'react-native'
import { copyFileIfNeeded } from './LlamaFileUtils'

const DEFAULT_MODEL_URL = 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf'

export class LlamaModelManager {
  private static instance: LlamaModelManager
  private isDownloading = false
  private downloadProgress = 0
  private modelPath: string | null = null

  private constructor() {}

  static getInstance(): LlamaModelManager {
    if (!LlamaModelManager.instance) {
      LlamaModelManager.instance = new LlamaModelManager()
    }
    return LlamaModelManager.instance
  }

  async ensureModelExists(
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    // If we already have the model path, return it
    if (this.modelPath) {
      return this.modelPath
    }

    // Check if model exists in cache
    const dir = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/models`
    const filepath = `${dir}/mistral-7b-instruct.gguf`

    // Create directory if it doesn't exist
    if (!(await ReactNativeBlobUtil.fs.isDir(dir))) {
      await ReactNativeBlobUtil.fs.mkdir(dir)
    }

    // If model exists, return its path
    if (await ReactNativeBlobUtil.fs.exists(filepath)) {
      this.modelPath = filepath
      return filepath
    }

    // If already downloading, wait for it
    if (this.isDownloading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(async () => {
          if (this.modelPath) {
            clearInterval(checkInterval)
            resolve(this.modelPath)
          }
        }, 1000)
      })
    }

    // Start download
    this.isDownloading = true
    try {
      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: filepath,
      }).fetch('GET', DEFAULT_MODEL_URL, {
        // Add headers if needed
      })

      this.modelPath = filepath
      this.isDownloading = false
      return filepath
    } catch (error) {
      this.isDownloading = false
      console.error('Failed to download model:', error)
      throw error
    }
  }

  async getModelPath(): Promise<string | null> {
    return this.modelPath
  }

  getDownloadProgress(): number {
    return this.downloadProgress
  }

  isModelDownloading(): boolean {
    return this.isDownloading
  }
}
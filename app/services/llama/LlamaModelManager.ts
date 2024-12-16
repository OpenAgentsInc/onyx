import ReactNativeBlobUtil from 'react-native-blob-util'
import { Platform } from 'react-native'
import { copyFileIfNeeded } from './LlamaFileUtils'
import { handleContextRelease } from './LlamaContext'

const DEFAULT_MODEL_URL = 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf'

export class LlamaModelManager {
  private static instance: LlamaModelManager
  private isDownloading = false
  private downloadProgress = 0
  private modelPath: string | null = null
  private currentContext: any = null
  private isReleasing = false
  private releasePromise: Promise<void> | null = null
  private contextReleaseTimeout: NodeJS.Timeout | null = null
  private lastUsedTimestamp: number = 0

  private constructor() {}

  static getInstance(): LlamaModelManager {
    if (!LlamaModelManager.instance) {
      LlamaModelManager.instance = new LlamaModelManager()
    }
    return LlamaModelManager.instance
  }

  setContext(context: any) {
    if (this.currentContext && this.currentContext !== context) {
      console.warn("Setting new context before releasing old one")
    }
    this.currentContext = context
    this.lastUsedTimestamp = Date.now()
    
    // Clear any pending release
    if (this.contextReleaseTimeout) {
      clearTimeout(this.contextReleaseTimeout)
      this.contextReleaseTimeout = null
    }
  }

  touchContext() {
    this.lastUsedTimestamp = Date.now()
    if (this.contextReleaseTimeout) {
      clearTimeout(this.contextReleaseTimeout)
      this.contextReleaseTimeout = null
    }
  }

  async releaseContext(): Promise<void> {
    if (this.isReleasing) {
      return this.releasePromise!
    }

    if (!this.currentContext) {
      return Promise.resolve()
    }

    // If context was used in the last 5 minutes, don't release it
    const timeSinceLastUse = Date.now() - this.lastUsedTimestamp
    if (timeSinceLastUse < 5 * 60 * 1000) {
      console.log("Context recently used, skipping release")
      return Promise.resolve()
    }

    this.isReleasing = true
    this.releasePromise = new Promise((resolve, reject) => {
      handleContextRelease(
        this.currentContext,
        () => {
          console.log("Context released successfully")
          this.currentContext = null
          this.isReleasing = false
          resolve()
        },
        (err) => {
          console.error("Failed to release context:", err)
          this.isReleasing = false
          // Don't reject, just resolve and continue
          resolve()
        }
      )
    })

    return this.releasePromise
  }

  scheduleContextRelease() {
    if (this.contextReleaseTimeout) {
      clearTimeout(this.contextReleaseTimeout)
    }

    // Schedule release after 5 minutes of inactivity
    this.contextReleaseTimeout = setTimeout(() => {
      if (Date.now() - this.lastUsedTimestamp > 5 * 60 * 1000) {
        this.releaseContext()
      }
    }, 5 * 60 * 1000)
  }

  async waitForRelease(): Promise<void> {
    if (this.isReleasing && this.releasePromise) {
      await this.releasePromise
    }
  }

  async ensureModelExists(
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    // Wait for any pending release to complete
    await this.waitForRelease()

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

  hasActiveContext(): boolean {
    return this.currentContext !== null
  }

  getContext(): any {
    this.touchContext() // Update last used timestamp
    return this.currentContext
  }
}
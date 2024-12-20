import ReactNativeBlobUtil from "react-native-blob-util"
import { AppState, AppStateStatus } from "react-native"

import type { DocumentPickerResponse } from 'react-native-document-picker'

const { dirs } = ReactNativeBlobUtil.fs

export type ProgressCallback = (progress: number, received: number, total: number) => void

export class ModelDownloader {
  private readonly cacheDir: string
  private currentDownload: ReactNativeBlobUtil.StatefulPromise | null = null
  private appStateSubscription: any = null

  constructor() {
    this.cacheDir = `${dirs.CacheDir}/models`
  }

  async ensureDirectory(): Promise<void> {
    if (!(await ReactNativeBlobUtil.fs.isDir(this.cacheDir))) {
      await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
    }
  }

  async cleanDirectory(): Promise<void> {
    if (await ReactNativeBlobUtil.fs.exists(this.cacheDir)) {
      await ReactNativeBlobUtil.fs.unlink(this.cacheDir)
    }
    await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // Cancel ongoing download if app goes to background
      if (this.currentDownload) {
        this.currentDownload.cancel((err) => {
          console.log('Download cancelled due to app minimization:', err)
        })
        this.currentDownload = null
        
        // Clean up partial download
        await this.cleanDirectory()
      }
    }
  }

  async downloadModel(
    repoId: string,
    filename: string,
    onProgress?: ProgressCallback
  ): Promise<DocumentPickerResponse> {
    const filepath = `${this.cacheDir}/${filename}`

    // Setup app state monitoring
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange)

    try {
      await this.ensureDirectory()

      // If the file already exists, validate it first
      if (await ReactNativeBlobUtil.fs.exists(filepath)) {
        try {
          const stats = await ReactNativeBlobUtil.fs.stat(filepath)
          // Basic validation - ensure file is not empty
          if (stats.size > 0) {
            return { uri: filepath } as DocumentPickerResponse
          }
        } catch (e) {
          console.log('File validation failed:', e)
        }
        // If validation fails, clean and redownload
        await this.cleanDirectory()
      }

      // Clean directory first to ensure no leftovers
      await this.cleanDirectory()

      // Download the model file from Hugging Face
      this.currentDownload = ReactNativeBlobUtil.config({
        fileCache: true,
        path: filepath,
        timeout: 30000 // 30 second timeout
      }).fetch(
        'GET',
        `https://huggingface.co/${repoId}/resolve/main/${filename}`
      )

      const response = await this.currentDownload.progress((received, total) => {
        const progress = Math.round((received / total) * 100)
        onProgress?.(progress, received, total)
      })

      // Validate downloaded file
      const stats = await ReactNativeBlobUtil.fs.stat(response.path())
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty')
      }

      return { uri: response.path() } as DocumentPickerResponse
    } finally {
      // Cleanup
      this.currentDownload = null
      this.appStateSubscription?.remove()
      this.appStateSubscription = null
    }
  }
}
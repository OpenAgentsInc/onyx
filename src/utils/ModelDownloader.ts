import ReactNativeBlobUtil from "react-native-blob-util"
import { AppState, AppStateStatus } from "react-native"
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore } from '@/store/useModelStore'

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
          useModelStore.getState().setError('Download cancelled due to app being backgrounded')
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
  ): Promise<DocumentPickerResponse> {
    const filepath = `${this.cacheDir}/${filename}`
    const store = useModelStore.getState()

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
            store.setModelPath(filepath)
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

      store.startDownload()

      // Download the model file from Hugging Face
      this.currentDownload = ReactNativeBlobUtil.config({
        fileCache: true,
        path: filepath,
        timeout: 0, // No timeout
        IOSBackgroundTask: true, // Enable background download on iOS
      }).fetch(
        'GET',
        `https://huggingface.co/${repoId}/resolve/main/${filename}`,
        {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      )

      const response = await this.currentDownload.progress((received, total) => {
        const progress = Math.round((received / total) * 100)
        store.updateProgress(progress)
      })

      // Validate downloaded file
      const stats = await ReactNativeBlobUtil.fs.stat(response.path())
      if (stats.size === 0) {
        store.setError('Downloaded file is empty')
        throw new Error('Downloaded file is empty')
      }

      store.setModelPath(response.path())
      return { uri: response.path() } as DocumentPickerResponse
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Unknown error during download')
      throw error
    } finally {
      // Cleanup
      this.currentDownload = null
      this.appStateSubscription?.remove()
      this.appStateSubscription = null
    }
  }

  cancelDownload() {
    if (this.currentDownload) {
      this.currentDownload.cancel(() => {
        console.log('Download cancelled by user')
      })
      this.currentDownload = null
      useModelStore.getState().cancelDownload()
    }
  }
}
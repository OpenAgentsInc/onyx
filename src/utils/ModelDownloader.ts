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
    try {
      if (!(await ReactNativeBlobUtil.fs.isDir(this.cacheDir))) {
        await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
      }
      // Verify directory was created
      const exists = await ReactNativeBlobUtil.fs.isDir(this.cacheDir)
      if (!exists) {
        throw new Error('Failed to create models directory')
      }
    } catch (error) {
      console.error('Error ensuring directory exists:', error)
      throw error
    }
  }

  async cleanDirectory(): Promise<void> {
    try {
      if (await ReactNativeBlobUtil.fs.exists(this.cacheDir)) {
        await ReactNativeBlobUtil.fs.unlink(this.cacheDir)
      }
      await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
      
      // Verify directory was created after cleaning
      const exists = await ReactNativeBlobUtil.fs.isDir(this.cacheDir)
      if (!exists) {
        throw new Error('Failed to recreate models directory after cleaning')
      }
    } catch (error) {
      console.error('Error cleaning directory:', error)
      throw error
    }
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
    console.log('Starting download to filepath:', filepath)

    // Setup app state monitoring
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange)

    try {
      // First ensure directory exists
      await this.ensureDirectory()
      console.log('Directory ensured:', this.cacheDir)

      // Check for existing file
      if (await ReactNativeBlobUtil.fs.exists(filepath)) {
        try {
          const stats = await ReactNativeBlobUtil.fs.stat(filepath)
          console.log('Existing file stats:', stats)
          if (stats.size > 0) {
            store.setModelPath(filepath)
            return { uri: filepath } as DocumentPickerResponse
          }
        } catch (e) {
          console.log('File validation failed:', e)
          await this.cleanDirectory()
        }
      }

      store.startDownload()
      console.log('Starting download from HuggingFace:', repoId, filename)

      this.currentDownload = ReactNativeBlobUtil.config({
        fileCache: true,
        path: filepath,
        timeout: 0, // No timeout for large files
        IOSBackgroundTask: true,
        indicator: true,
        overwrite: true,
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
        console.log(`Download progress: ${progress}% (${received}/${total} bytes)`)
      })

      console.log('Download completed, checking file...')
      
      // Verify directory still exists
      await this.ensureDirectory()
      
      // Get the final path from the response
      const downloadedPath = response.path()
      console.log('Downloaded file path:', downloadedPath)
      
      // Validate downloaded file
      const stats = await ReactNativeBlobUtil.fs.stat(downloadedPath)
      console.log('Downloaded file stats:', stats)
      
      if (stats.size === 0) {
        store.setError('Downloaded file is empty')
        throw new Error('Downloaded file is empty')
      }

      store.setModelPath(downloadedPath)
      return { uri: downloadedPath } as DocumentPickerResponse
    } catch (error) {
      console.error('Download error:', error)
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
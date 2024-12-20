import ReactNativeBlobUtil from "react-native-blob-util"
import { AppState, AppStateStatus } from "react-native"
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore } from '@/store/useModelStore'

const { dirs } = ReactNativeBlobUtil.fs

export type ProgressCallback = (progress: number, received: number, total: number) => void

export class ModelDownloader {
  readonly cacheDir: string
  private currentDownload: ReactNativeBlobUtil.StatefulPromise | null = null
  private appStateSubscription: any = null

  constructor() {
    this.cacheDir = `${dirs.CacheDir}/models`
  }

  async ensureDirectory(): Promise<void> {
    try {
      // First check if directory exists
      const exists = await ReactNativeBlobUtil.fs.isDir(this.cacheDir)
      
      if (!exists) {
        // If it doesn't exist, create it
        await ReactNativeBlobUtil.fs.mkdir(this.cacheDir)
        
        // Verify directory was created
        const created = await ReactNativeBlobUtil.fs.isDir(this.cacheDir)
        if (!created) {
          throw new Error('Failed to create models directory')
        }
      }
    } catch (error) {
      console.error('Error ensuring directory exists:', error)
      throw error
    }
  }

  async cleanDirectory(): Promise<void> {
    try {
      // First ensure parent directory exists
      const parentDir = this.cacheDir.split('/').slice(0, -1).join('/')
      if (!(await ReactNativeBlobUtil.fs.isDir(parentDir))) {
        throw new Error('Parent directory does not exist')
      }

      // Then handle the models directory
      if (await ReactNativeBlobUtil.fs.exists(this.cacheDir)) {
        // If it exists, try to delete it
        await ReactNativeBlobUtil.fs.unlink(this.cacheDir)
      }

      // Create a fresh directory
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
        try {
          await this.cleanDirectory()
        } catch (e) {
          console.error('Failed to clean directory after cancellation:', e)
        }
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
        appendExt: 'tmp' // Use temporary extension during download
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
      
      // Get the final path from the response
      const tempPath = response.path()
      console.log('Downloaded file temp path:', tempPath)
      
      // Validate downloaded file
      const stats = await ReactNativeBlobUtil.fs.stat(tempPath)
      console.log('Downloaded file stats:', stats)
      
      if (stats.size === 0) {
        await ReactNativeBlobUtil.fs.unlink(tempPath)
        store.setError('Downloaded file is empty')
        throw new Error('Downloaded file is empty')
      }

      // Move file to final location
      await ReactNativeBlobUtil.fs.mv(tempPath, filepath)
      console.log('Moved file to final location:', filepath)

      // Verify final file
      const finalStats = await ReactNativeBlobUtil.fs.stat(filepath)
      if (finalStats.size !== stats.size) {
        throw new Error('File size mismatch after move')
      }

      store.setModelPath(filepath)
      return { uri: filepath } as DocumentPickerResponse
    } catch (error) {
      console.error('Download error:', error)
      
      // Clean up any partial downloads
      try {
        await this.cleanDirectory()
      } catch (e) {
        console.error('Failed to clean up after error:', e)
      }
      
      store.setError(error instanceof Error ? error.message : 'Unknown error during download')
      store.reset() // Reset store to idle state
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
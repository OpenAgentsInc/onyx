import ReactNativeBlobUtil from "react-native-blob-util"
import { AppState, AppStateStatus } from "react-native"
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore } from '@/store/useModelStore'
import * as FileSystem from 'expo-file-system'

const { dirs } = ReactNativeBlobUtil.fs

export type ProgressCallback = (progress: number, received: number, total: number) => void

export class ModelDownloader {
  readonly cacheDir: string
  private currentDownload: ReactNativeBlobUtil.StatefulPromise | null = null
  private appStateSubscription: any = null

  constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}models`
  }

  async ensureDirectory(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir)
      if (!dirInfo.exists) {
        console.log("Models directory doesn't exist, creating...")
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true })
      }
    } catch (error) {
      console.error('Error ensuring directory exists:', error)
      throw error
    }
  }

  async cleanDirectory(): Promise<void> {
    try {
      if (await FileSystem.getInfoAsync(this.cacheDir).then(info => info.exists)) {
        await FileSystem.deleteAsync(this.cacheDir)
      }
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true })
    } catch (error) {
      console.error('Error cleaning directory:', error)
      throw error
    }
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      if (this.currentDownload) {
        this.currentDownload.cancel((err) => {
          console.log('Download cancelled due to app minimization:', err)
          useModelStore.getState().setError('Download cancelled due to app being backgrounded')
        })
        this.currentDownload = null
        
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
      const fileInfo = await FileSystem.getInfoAsync(filepath)
      if (fileInfo.exists) {
        try {
          if (fileInfo.size > 0) {
            store.setModelPath(filepath)
            store.startInitialization() // Start initialization for existing file
            return { uri: filepath } as DocumentPickerResponse
          }
        } catch (e) {
          console.log('File validation failed:', e)
          await this.cleanDirectory()
        }
      }

      store.startDownload()
      console.log('Starting download from HuggingFace:', repoId, filename)

      // Download to a temporary file first
      const tempFilename = `${filename}.tmp`
      const tempPath = `${this.cacheDir}/${tempFilename}`

      this.currentDownload = ReactNativeBlobUtil.config({
        fileCache: true,
        path: tempPath,
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
      
      // Get the final path from the response
      const downloadedPath = response.path()
      console.log('Downloaded file temp path:', downloadedPath)
      
      // Validate downloaded file
      const stats = await FileSystem.getInfoAsync(downloadedPath)
      console.log('Downloaded file stats:', stats)
      
      if (!stats.exists || stats.size === 0) {
        store.setError('Downloaded file is empty or missing')
        throw new Error('Downloaded file is empty or missing')
      }

      // Move file to final location
      console.log('Moving file from', downloadedPath, 'to', filepath)
      await FileSystem.moveAsync({
        from: downloadedPath,
        to: filepath
      })

      // Verify final file
      const finalStats = await FileSystem.getInfoAsync(filepath)
      console.log('Final file stats:', finalStats)
      if (!finalStats.exists || finalStats.size === 0) {
        throw new Error('File move failed or resulted in empty file')
      }

      store.setModelPath(filepath)
      store.startInitialization() // Start initialization after successful download
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
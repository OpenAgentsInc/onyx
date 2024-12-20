import * as FileSystem from 'expo-file-system'
import { AppState, AppStateStatus } from "react-native"
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore } from '@/store/useModelStore'

export async function downloadModel(
  repoId: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<DocumentPickerResponse> {
  const modelsDir = `${FileSystem.cacheDirectory}models`
  const filepath = `${modelsDir}/${filename}`
  const store = useModelStore.getState()
  console.log('Starting download to filepath:', filepath)

  // Setup app state monitoring
  let appStateSubscription: any = null
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log('App going to background, cancelling download')
      store.setError('Download cancelled due to app being backgrounded')
      
      try {
        // Clean up partial download
        if (await FileSystem.getInfoAsync(filepath).then(info => info.exists)) {
          await FileSystem.deleteAsync(filepath)
        }
      } catch (e) {
        console.error('Failed to clean up after cancellation:', e)
      }
    }
  }
  appStateSubscription = AppState.addEventListener('change', handleAppStateChange)

  try {
    // First ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(modelsDir)
    if (!dirInfo.exists) {
      console.log("Models directory doesn't exist, creating...")
      await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true })
    }

    // Check for existing file
    const fileInfo = await FileSystem.getInfoAsync(filepath)
    if (fileInfo.exists) {
      try {
        if (fileInfo.size && fileInfo.size > 0) {
          store.setModelPath(filepath)
          store.startInitialization() // Start initialization for existing file
          return { uri: filepath } as DocumentPickerResponse
        }
      } catch (e) {
        console.log('File validation failed:', e)
        await FileSystem.deleteAsync(filepath)
      }
    }

    store.startDownload()
    console.log('Starting download from HuggingFace:', repoId, filename)

    // Download file
    const downloadResult = await FileSystem.downloadAsync(
      `https://huggingface.co/${repoId}/resolve/main/${filename}`,
      filepath,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        md5: true
      }
    )

    // Verify download
    const finalInfo = await FileSystem.getInfoAsync(filepath, { size: true })
    if (!finalInfo.exists || !finalInfo.size || finalInfo.size === 0) {
      throw new Error('Downloaded file is empty or missing')
    }

    store.setModelPath(filepath)
    store.startInitialization() // Start initialization after successful download
    return { uri: filepath } as DocumentPickerResponse
  } catch (error) {
    console.error('Download error:', error)
    
    // Clean up any partial downloads
    try {
      if (await FileSystem.getInfoAsync(filepath).then(info => info.exists)) {
        await FileSystem.deleteAsync(filepath)
      }
    } catch (e) {
      console.error('Failed to clean up after error:', e)
    }
    
    store.setError(error instanceof Error ? error.message : 'Unknown error during download')
    store.reset() // Reset store to idle state
    throw error
  } finally {
    // Cleanup
    appStateSubscription?.remove()
  }
}
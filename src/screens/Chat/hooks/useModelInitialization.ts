import { useEffect, useRef } from 'react'
import ReactNativeBlobUtil from 'react-native-blob-util'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { addSystemMessage } from '../utils'

export const useModelInitialization = (
  downloader: ModelDownloader,
  setMessages: any,
  setInitializing: (value: boolean) => void,
  handleInitContext: (file: DocumentPickerResponse) => Promise<void>
) => {
  const { selectedModelKey, status } = useModelStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Skip if we've already initialized or if we're in a non-idle state
    if (hasInitialized.current || status !== 'idle') {
      return
    }

    const initModel = async () => {
      const currentModel = getCurrentModelConfig()
      const filePath = `${downloader.cacheDir}/${currentModel.filename}`
      
      try {
        const exists = await ReactNativeBlobUtil.fs.exists(filePath)
        if (exists) {
          hasInitialized.current = true
          addSystemMessage(setMessages, [], 'Model found locally, initializing...')
          await handleInitContext({ uri: filePath } as DocumentPickerResponse)
        }
      } catch (error) {
        console.error('Model initialization failed:', error)
      } finally {
        setInitializing(false)
      }
    }

    initModel()
  }, [selectedModelKey, downloader, status]) // Removed most dependencies
}
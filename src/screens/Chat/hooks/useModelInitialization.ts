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
  const { selectedModelKey, status, needsInitialization } = useModelStore()
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Skip if we're not in a state that needs initialization
    if (!needsInitialization || status !== 'idle') {
      return
    }

    const initModel = async () => {
      setInitializing(true)
      const currentModel = getCurrentModelConfig()
      const filePath = `${downloader.cacheDir}/${currentModel.filename}`
      
      try {
        const exists = await ReactNativeBlobUtil.fs.exists(filePath)
        if (exists) {
          hasInitialized.current = true
          addSystemMessage(setMessages, [], `${currentModel.displayName} found locally, initializing...`)
          await handleInitContext({ uri: filePath } as DocumentPickerResponse)
        } else {
          // If the file doesn't exist, just set initializing to false to show download button
          setInitializing(false)
        }
      } catch (error) {
        console.error('Model initialization failed:', error)
        setInitializing(false)
      }
    }

    // Reset initialization flag when switching models
    hasInitialized.current = false
    initModel()
  }, [selectedModelKey, needsInitialization, status]) // Added needsInitialization dependency
}
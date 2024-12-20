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
  const hasInitialized = useRef<{[key: string]: boolean}>({})

  useEffect(() => {
    // Skip if we're not in a state that needs initialization
    if (!needsInitialization || status !== 'idle') {
      return
    }

    const initModel = async () => {
      // Skip if we've already initialized this model
      if (hasInitialized.current[selectedModelKey]) {
        return
      }

      setInitializing(true)
      const currentModel = getCurrentModelConfig()
      const filePath = `${downloader.cacheDir}/${currentModel.filename}`
      
      try {
        const exists = await ReactNativeBlobUtil.fs.exists(filePath)
        if (exists) {
          console.log(`Found model file for ${selectedModelKey}:`, filePath)
          hasInitialized.current[selectedModelKey] = true
          addSystemMessage(setMessages, [], `${currentModel.displayName} found locally, initializing...`)
          await handleInitContext({ uri: filePath } as DocumentPickerResponse)
        } else {
          console.log(`No model file found for ${selectedModelKey}`)
          // If the file doesn't exist, just set initializing to false to show download button
          setInitializing(false)
        }
      } catch (error) {
        console.error('Model initialization failed:', error)
        setInitializing(false)
      }
    }

    initModel()
  }, [selectedModelKey, needsInitialization, status])

  // Reset initialization tracking when model is released
  useEffect(() => {
    if (status === 'releasing') {
      hasInitialized.current = {}
    }
  }, [status])
}
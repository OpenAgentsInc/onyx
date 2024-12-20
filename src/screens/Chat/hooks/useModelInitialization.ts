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
  const previousModelKey = useRef(selectedModelKey)

  useEffect(() => {
    // Log state changes
    console.log('Model initialization state:', {
      selectedModelKey,
      previousModelKey: previousModelKey.current,
      status,
      needsInitialization
    })

    // Skip if we're not in a state that needs initialization
    if (!needsInitialization || status !== 'idle') {
      return
    }

    // Skip if we haven't actually changed models
    if (selectedModelKey === previousModelKey.current && status === 'idle') {
      return
    }

    const initModel = async () => {
      setInitializing(true)
      const currentModel = getCurrentModelConfig()
      const filePath = `${downloader.cacheDir}/${currentModel.filename}`
      
      try {
        console.log(`Checking for model file: ${filePath}`)
        const exists = await ReactNativeBlobUtil.fs.exists(filePath)
        if (exists) {
          console.log(`Found model file for ${selectedModelKey}:`, filePath)
          previousModelKey.current = selectedModelKey
          addSystemMessage(setMessages, [], `${currentModel.displayName} found locally, initializing...`)
          await handleInitContext({ uri: filePath } as DocumentPickerResponse)
        } else {
          console.log(`No model file found for ${selectedModelKey}`)
          setInitializing(false)
        }
      } catch (error) {
        console.error('Model initialization failed:', error)
        setInitializing(false)
      }
    }

    initModel()
  }, [selectedModelKey, status, needsInitialization])

  // Update previous model key when status changes to ready
  useEffect(() => {
    if (status === 'ready') {
      previousModelKey.current = selectedModelKey
    }
  }, [status, selectedModelKey])
}
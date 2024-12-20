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
  const isInitializing = useRef(false)

  useEffect(() => {
    // Log state changes
    console.log('Model initialization state:', {
      selectedModelKey,
      previousModelKey: previousModelKey.current,
      status,
      needsInitialization,
      isInitializing: isInitializing.current
    })

    // Skip if already initializing
    if (isInitializing.current) {
      console.log('Already initializing, skipping')
      return
    }

    // Skip if we're not in a state that needs initialization
    if (!needsInitialization || status !== 'idle') {
      console.log('Skipping initialization - wrong state:', { needsInitialization, status })
      return
    }

    const initModel = async () => {
      isInitializing.current = true
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
      } finally {
        isInitializing.current = false
      }
    }

    initModel()
  }, [selectedModelKey, status, needsInitialization])

  // Reset initialization flag when status changes
  useEffect(() => {
    if (status === 'ready' || status === 'error') {
      isInitializing.current = false
      previousModelKey.current = selectedModelKey
    }
  }, [status, selectedModelKey])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isInitializing.current = false
    }
  }, [])
}
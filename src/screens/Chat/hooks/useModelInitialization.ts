import { useEffect, useRef } from 'react'
import * as FileSystem from 'expo-file-system'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'

export const useModelInitialization = (
  setInitializing: (value: boolean) => void,
  handleInitContext: (file: DocumentPickerResponse) => Promise<void>
) => {
  const { selectedModelKey, status, modelPath, isInitializing: storeInitializing } = useModelStore()
  const previousModelKey = useRef(selectedModelKey)
  const isInitializing = useRef(false)
  const store = useModelStore.getState()

  // Handle actual initialization
  const initializeModel = async (path: string) => {
    console.log('[Init] Starting model initialization with path:', path)
    try {
      const fileInfo = await FileSystem.getInfoAsync(path)
      if (!fileInfo.exists) {
        console.error('[Init] Model file not found:', path)
        store.setError('Model file not found')
        return
      }

      // Create a DocumentPickerResponse-like object
      const file = {
        uri: path,
        type: 'application/octet-stream',
        name: path.split('/').pop() || 'model.gguf',
        size: fileInfo.size,
      }

      // Start initialization
      await handleInitContext(file)
    } catch (err) {
      console.error('[Init] Failed to initialize model:', err)
      store.setError(err instanceof Error ? err.message : 'Failed to initialize model')
    }
  }

  useEffect(() => {
    // Log state changes
    console.log('[Init] State:', {
      selectedModelKey,
      previousModelKey: previousModelKey.current,
      status,
      modelPath,
      isInitializing: isInitializing.current,
      storeInitializing,
    })

    // Reset when model changes
    if (selectedModelKey !== previousModelKey.current) {
      console.log('[Init] Model changed, resetting state')
      isInitializing.current = false
      previousModelKey.current = selectedModelKey
      return // Exit early on model change
    }

    // Skip if already initializing
    if (isInitializing.current) {
      console.log('[Init] Already initializing, skipping')
      return
    }

    // Handle releasing state - wait for it to complete
    if (status === 'releasing') {
      console.log('[Init] Model is being released, waiting...')
      return
    }

    // Initialize if we have a path and are in initializing state
    if (modelPath && status === 'initializing' && !isInitializing.current) {
      console.log('[Init] Starting initialization with path:', modelPath)
      isInitializing.current = true
      setInitializing(true)
      store.startInitialization()
      initializeModel(modelPath)
    }
  }, [selectedModelKey, status, modelPath, storeInitializing])

  // Reset initialization flag when status changes to ready/error
  useEffect(() => {
    if (status === 'ready' || status === 'error') {
      console.log('[Init] Status changed to', status, '- resetting flags')
      isInitializing.current = false
      setInitializing(false)
      previousModelKey.current = selectedModelKey
    }
  }, [status, selectedModelKey])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[Init] Unmounting - resetting flags')
      isInitializing.current = false
      setInitializing(false)
    }
  }, [])
}
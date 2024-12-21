import { useEffect, useRef } from 'react'
import * as FileSystem from 'expo-file-system'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'

// This hook now only monitors state and triggers initialization in useModelContext
export const useModelInitialization = (
  setInitializing: (value: boolean) => void,
  handleInitContext: (file: DocumentPickerResponse) => Promise<void>
) => {
  const { selectedModelKey, status, modelPath, isInitializing: storeInitializing } = useModelStore()
  const previousModelKey = useRef(selectedModelKey)
  const isInitializing = useRef(false)
  const store = useModelStore.getState()

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
    if (isInitializing.current || storeInitializing) {
      console.log('[Init] Already initializing, skipping')
      return
    }

    // Handle releasing state - wait for it to complete
    if (status === 'releasing') {
      console.log('[Init] Model is being released, waiting...')
      return
    }

    // Skip if we're not in a state that needs initialization
    if (!modelPath || (status !== 'idle' && status !== 'initializing')) {
      console.log('[Init] Skipping - wrong state:', { modelPath, status })
      return
    }

    // Only set flags, let useModelContext handle actual initialization
    if (status === 'initializing' && modelPath) {
      console.log('[Init] Setting initialization flags')
      isInitializing.current = true
      setInitializing(true)
      store.startInitialization()
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
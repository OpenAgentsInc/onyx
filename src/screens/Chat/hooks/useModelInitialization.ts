import { useEffect, useRef } from 'react'
import * as FileSystem from 'expo-file-system'
import { Alert } from 'react-native'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { addSystemMessage } from '../utils'

export const useModelInitialization = (
  setMessages: any,
  setInitializing: (value: boolean) => void,
  handleInitContext: (file: DocumentPickerResponse) => Promise<void>
) => {
  const { selectedModelKey, status, needsInitialization } = useModelStore()
  const previousModelKey = useRef(selectedModelKey)
  const isInitializing = useRef(false)
  const store = useModelStore.getState()

  useEffect(() => {
    // Log state changes
    console.log('[Init] State:', {
      selectedModelKey,
      previousModelKey: previousModelKey.current,
      status,
      needsInitialization,
      isInitializing: isInitializing.current,
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

    // Skip if we're not in a state that needs initialization
    if (!needsInitialization || (status !== 'idle' && status !== 'initializing')) {
      console.log('[Init] Skipping - wrong state:', { needsInitialization, status })
      return
    }

    const initModel = async () => {
      if (isInitializing.current) {
        console.log('[Init] Already initializing (double-check), skipping')
        return
      }

      console.log('[Init] Starting initialization')
      isInitializing.current = true
      setInitializing(true)

      try {
        const currentModel = getCurrentModelConfig()
        const filePath = `${FileSystem.cacheDirectory}models/${currentModel.filename}`
        
        console.log(`[Init] Checking for model file: ${filePath}`)
        const fileInfo = await FileSystem.getInfoAsync(filePath)
        
        if (!fileInfo.exists) {
          console.log('[Init] No model file found')
          store.setIdle()
          return
        }

        // Basic size validation
        const MIN_SIZE = 100 * 1024 * 1024 // 100MB
        if (!fileInfo.size || fileInfo.size < MIN_SIZE) {
          console.error('[Init] Model file too small:', fileInfo.size)
          throw new Error('Model file appears to be incomplete')
        }

        console.log('[Init] Starting model initialization')
        await handleInitContext({ uri: filePath } as DocumentPickerResponse)
        console.log('[Init] Model initialized successfully')

      } catch (error) {
        console.error('[Init] Initialization failed:', error)
        
        // Clean up the file and reset state
        try {
          const filePath = `${FileSystem.cacheDirectory}models/${getCurrentModelConfig().filename}`
          const fileInfo = await FileSystem.getInfoAsync(filePath)
          if (fileInfo.exists) {
            console.log('[Init] Cleaning up model file')
            await FileSystem.deleteAsync(filePath, { idempotent: true })
          }
        } catch (deleteError) {
          console.warn('[Init] Error cleaning up model file:', deleteError)
        }

        // Show error and reset state
        const message = error.message?.includes('Context limit reached')
          ? 'Not enough memory to initialize model. Please try again or contact support if the issue persists.'
          : error.message || 'Failed to initialize model'
        
        console.log('[Init] Setting error:', message)
        store.setError(message)
        addSystemMessage(setMessages, [], message)
        Alert.alert('Initialization Error', message)

      } finally {
        console.log('[Init] Cleanup - resetting flags')
        isInitializing.current = false
        setInitializing(false)
      }
    }

    initModel()
  }, [selectedModelKey, status, needsInitialization])

  // Reset initialization flag when status changes to ready/error
  useEffect(() => {
    if (status === 'ready' || status === 'error') {
      console.log('[Init] Status changed to', status, '- resetting flags')
      isInitializing.current = false
      previousModelKey.current = selectedModelKey
    }
  }, [status, selectedModelKey])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[Init] Unmounting - resetting flags')
      isInitializing.current = false
    }
  }, [])
}
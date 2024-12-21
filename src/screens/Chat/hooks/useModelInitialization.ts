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
  const initAttempts = useRef(0)
  const MAX_ATTEMPTS = 1 // Only try once before suggesting smaller model

  useEffect(() => {
    // Log state changes
    console.log('Model initialization state:', {
      selectedModelKey,
      previousModelKey: previousModelKey.current,
      status,
      needsInitialization,
      isInitializing: isInitializing.current,
      attempts: initAttempts.current
    })

    // Reset attempts when model changes
    if (selectedModelKey !== previousModelKey.current) {
      console.log('Model changed, resetting attempts')
      initAttempts.current = 0
      isInitializing.current = false
    }

    // Skip if already initializing
    if (isInitializing.current) {
      console.log('Already initializing, skipping')
      return
    }

    // Handle releasing state - wait for it to complete
    if (status === 'releasing') {
      console.log('Model is being released, waiting...')
      return
    }

    // Skip if we're not in a state that needs initialization
    if (!needsInitialization || (status !== 'idle' && status !== 'initializing')) {
      console.log('Skipping initialization - wrong state:', { needsInitialization, status })
      return
    }

    // Skip if we've exceeded max attempts
    if (initAttempts.current >= MAX_ATTEMPTS) {
      console.log('Max initialization attempts reached, suggesting smaller model')
      const message = 'Not enough memory to initialize model. Try the 1B model instead.'
      store.setError(message)
      addSystemMessage(setMessages, [], message)
      Alert.alert('Memory Error', message)
      return
    }

    const initModel = async () => {
      isInitializing.current = true
      setInitializing(true)
      const currentModel = getCurrentModelConfig()
      const filePath = `${FileSystem.cacheDirectory}models/${currentModel.filename}`
      
      try {
        console.log(`Checking for model file: ${filePath}`)
        const fileInfo = await FileSystem.getInfoAsync(filePath)
        if (fileInfo.exists) {
          try {
            // Basic size validation (100MB minimum for typical models)
            const MIN_SIZE = 100 * 1024 * 1024 // 100MB
            if (!fileInfo.size || fileInfo.size < MIN_SIZE) {
              console.error('Model file too small:', fileInfo.size)
              throw new Error('Model file appears to be incomplete')
            }

            previousModelKey.current = selectedModelKey
            addSystemMessage(setMessages, [], `${currentModel.displayName} found locally, initializing...`)
            await handleInitContext({ uri: filePath } as DocumentPickerResponse)
            
            // Reset attempts on success
            initAttempts.current = 0
            store.setReady()
          } catch (error) {
            console.error('Model validation/initialization failed:', error)
            initAttempts.current++
            
            if (error.message?.includes('Context limit reached')) {
              // If it's a context limit error, suggest smaller model
              console.log('Context limit reached, suggesting smaller model')
              const message = 'Not enough memory to initialize model. Try the 1B model instead.'
              store.setError(message)
              addSystemMessage(setMessages, [], message)
              Alert.alert('Memory Error', message)
            } else {
              // For other errors, clean up and rethrow
              try {
                const fileInfo = await FileSystem.getInfoAsync(filePath)
                if (fileInfo.exists) {
                  await FileSystem.deleteAsync(filePath, { idempotent: true })
                }
              } catch (deleteError) {
                console.warn('Error cleaning up model file:', deleteError)
                // Continue with error handling even if cleanup fails
              }
              throw error
            }
          }
        } else {
          console.log(`No model file found for ${selectedModelKey}`)
          setInitializing(false)
          // Just reset to idle without trying to initialize
          store.setIdle()
        }
      } catch (error) {
        console.error('Model initialization failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error'
        store.setError(errorMessage)
        addSystemMessage(setMessages, [], `Error: ${errorMessage}`)
        Alert.alert('Initialization Error', errorMessage)
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
      initAttempts.current = 0
    }
  }, [])
}
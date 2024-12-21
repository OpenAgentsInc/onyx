import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import type { LlamaContext } from 'llama.rn'
import { initLlama, loadLlamaModelInfo } from 'llama.rn'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { addSystemMessage, handleReleaseContext } from '../utils'
import * as FileSystem from 'expo-file-system'

export const useModelContext = (setMessages: any, messages: any[]) => {
  const [context, setContext] = useState<LlamaContext | undefined>(undefined)
  const store = useModelStore()

  // Effect to handle model switching
  useEffect(() => {
    const cleanup = async () => {
      if (context) {
        try {
          console.log('[Context] Releasing context')
          await handleReleaseContext(context, setContext, setMessages, messages, addSystemMessage)
          // After successful release, reset store
          console.log('[Context] Released context - resetting store')
          store.reset()
        } catch (err) {
          console.error('[Context] Failed to release context:', err)
          store.setError('Failed to release previous model')
        }
      } else {
        console.log('[Context] No context to release - resetting store')
        store.reset()
      }
    }

    // If we're in releasing state, clean up the old context
    if (store.status === 'releasing') {
      console.log('[Context] Status is releasing - starting cleanup')
      cleanup()
    }
  }, [store.status, store.selectedModelKey])

  const getModelInfo = async (model: string) => {
    const t0 = Date.now()
    try {
      console.log('[Context] Loading model info')
      const info = await loadLlamaModelInfo(model)
      console.log(`[Context] Model info loaded (${Date.now() - t0}ms):`, info)
      if (!info || Object.keys(info).length === 0) {
        throw new Error('Model info is empty - file may be corrupted')
      }
      return info
    } catch (error) {
      console.error('[Context] Failed to load model info:', error)
      throw new Error('Failed to validate model file - try downloading again')
    }
  }

  const handleInitContext = async (file: DocumentPickerResponse) => {
    console.log('[Context] Starting context initialization')
    
    // Only release context if we have one
    if (context) {
      try {
        console.log('[Context] Releasing existing context')
        await handleReleaseContext(context, setContext, setMessages, messages, addSystemMessage)
      } catch (err) {
        console.error('[Context] Failed to release context:', err)
        store.setError('Failed to release previous model')
        return
      }
    }

    const currentModel = getCurrentModelConfig()
    const msgId = addSystemMessage(setMessages, messages, `Initializing ${currentModel.displayName}...`)
    const t0 = Date.now()

    try {
      // First validate the model file
      console.log('[Context] Validating model file')
      await getModelInfo(file.uri)

      console.log('[Context] Starting llama initialization')
      const ctx = await initLlama(
        {
          model: file.uri,
          use_mlock: true,
          n_gpu_layers: Platform.OS === 'ios' ? 99 : 0,
        },
        (progress) => {
          setMessages((msgs: any[]) => {
            const index = msgs.findIndex((msg) => msg.id === msgId)
            if (index >= 0) {
              return msgs.map((msg, i) => {
                if (msg.type == 'text' && i === index) {
                  return {
                    ...msg,
                    text: `Initializing ${currentModel.displayName}... ${progress}%`,
                  }
                }
                return msg
              })}
            return msgs
          })
        }
      )

      const t1 = Date.now()
      console.log(`[Context] Initialization successful (${t1 - t0}ms)`)
      setContext(ctx)
      store.setReady()

      addSystemMessage(
        setMessages,
        [],
        `${currentModel.displayName} initialized!\n\nLoad time: ${t1 - t0}ms\nGPU: ${ctx.gpu ? 'YES' : 'NO'
        } (${ctx.reasonNoGPU})\nChat Template: ${ctx.model.isChatTemplateSupported ? 'YES' : 'NO'
        }\n\n` +
        'You can use the following commands:\n\n' +
        '- /info: to get the model info\n' +
        '- /release: release the context\n' +
        '- /stop: stop the current completion\n' +
        '- /reset: reset the conversation\n' +
        '- /save-session: save the session tokens\n' +
        '- /load-session: load the session tokens'
      )
    } catch (err: any) {
      console.error('[Context] Initialization failed:', err)
      
      // Clean up the file on initialization failure
      try {
        console.log('[Context] Cleaning up model file')
        const fileInfo = await FileSystem.getInfoAsync(file.uri)
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(file.uri, { idempotent: true })
        }
      } catch (deleteError) {
        console.warn('[Context] Error cleaning up model file:', deleteError)
      }

      // Set error state
      if (err.message?.includes('Context limit reached')) {
        const message = store.selectedModelKey === '1B'
          ? 'Not enough memory to initialize model. Please try again or contact support if the issue persists.'
          : 'Not enough memory to initialize model. Try the 1B model instead.'
        console.log('[Context] Setting context limit error:', message)
        store.setError(message)
        addSystemMessage(setMessages, [], message)
      } else {
        console.log('[Context] Setting general error:', err.message)
        store.setError(err.message || 'Failed to initialize model')
        addSystemMessage(setMessages, [], `Model initialization failed: ${err.message}`)
      }
      
      setContext(undefined)
    }
  }

  return {
    context,
    setContext,
    handleInitContext
  }
}
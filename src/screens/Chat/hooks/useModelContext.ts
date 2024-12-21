import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import type { LlamaContext } from 'llama.rn'
import { initLlama, loadLlamaModelInfo } from 'llama.rn'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { addSystemMessage, handleReleaseContext } from '../utils'

export const useModelContext = (setMessages: any, messages: any[]) => {
  const [context, setContext] = useState<LlamaContext | undefined>(undefined)
  const store = useModelStore()

  // Effect to handle model switching
  useEffect(() => {
    const cleanup = async () => {
      if (context) {
        try {
          await handleReleaseContext(context, setContext, setMessages, messages, addSystemMessage)
          // After successful release, set status to initializing if we have a model path
          if (store.modelPath) {
            store.startInitialization()
          } else {
            store.reset()
          }
        } catch (err) {
          console.error('Failed to release context during cleanup:', err)
          store.setError('Failed to release previous model')
        }
      } else {
        // If no context to release but we have a model path, start initialization
        if (store.modelPath) {
          store.startInitialization()
        } else {
          store.reset()
        }
      }
    }

    // If we're in releasing state, clean up the old context
    if (store.status === 'releasing') {
      cleanup()
    }
  }, [store.status, store.selectedModelKey])

  const getModelInfo = async (model: string) => {
    const t0 = Date.now()
    try {
      const info = await loadLlamaModelInfo(model)
      console.log(`Model info (took ${Date.now() - t0}ms): `, info)
      if (!info || Object.keys(info).length === 0) {
        throw new Error('Model info is empty - file may be corrupted')
      }
      return info
    } catch (error) {
      console.error('Failed to load model info:', error)
      throw new Error('Failed to validate model file - try downloading again')
    }
  }

  const handleInitContext = async (file: DocumentPickerResponse) => {
    // Only release context if we have one
    if (context) {
      try {
        await handleReleaseContext(context, setContext, setMessages, messages, addSystemMessage)
      } catch (err) {
        console.error('Failed to release context:', err)
        // Continue with initialization even if release fails
      }
    }

    const currentModel = getCurrentModelConfig()
    const msgId = addSystemMessage(setMessages, messages, `Initializing ${currentModel.displayName}...`)
    const t0 = Date.now()

    store.startInitialization()

    try {
      // First validate the model file
      await getModelInfo(file.uri)

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
      console.error('Model initialization failed:', err)
      store.setError(err.message || 'Failed to initialize model')
      addSystemMessage(setMessages, [], `Model initialization failed: ${err.message}`)
      setContext(undefined)
      throw err // Re-throw to handle in caller
    }
  }

  return {
    context,
    setContext,
    handleInitContext
  }
}
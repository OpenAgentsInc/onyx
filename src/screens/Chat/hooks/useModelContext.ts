import { useState } from 'react'
import { Platform } from 'react-native'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import type { LlamaContext } from 'llama.rn'
import { initLlama, loadLlamaModelInfo } from 'llama.rn'
import { useModelStore } from '@/store/useModelStore'
import { addSystemMessage, handleReleaseContext } from '../utils'

export const useModelContext = (setMessages: any, messages: any[]) => {
  const [context, setContext] = useState<LlamaContext | undefined>(undefined)
  const store = useModelStore()

  const getModelInfo = async (model: string) => {
    const t0 = Date.now()
    const info = await loadLlamaModelInfo(model)
    console.log(`Model info (took ${Date.now() - t0}ms): `, info)
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

    await getModelInfo(file.uri)
    const msgId = addSystemMessage(setMessages, messages, 'Initializing context...')
    const t0 = Date.now()

    store.startInitialization()

    try {
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
                    text: `Initializing context... ${progress}%`,
                  }
                }
                return msg
              })
            }
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
        `Context initialized!\n\nLoad time: ${t1 - t0}ms\nGPU: ${ctx.gpu ? 'YES' : 'NO'
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
      store.setError(err.message)
      addSystemMessage(setMessages, [], `Context initialization failed: ${err.message}`)
      throw err // Re-throw to handle in caller
    }
  }

  return {
    context,
    setContext,
    handleInitContext
  }
}
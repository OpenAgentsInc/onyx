import { observer } from "mobx-react-lite"
import React, { useRef, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SYSTEM_MESSAGE } from "@/features/llama/constants"
import { useLlamaChat } from "@/hooks/useLlamaChat"
import { useMessageHandler } from "@/hooks/useMessageHandler"
import { useStores } from "@/models"
import { handleCommand } from "@/services/llama/LlamaCommands"
import {
  getModelInfo, handleContextRelease, initializeLlamaContext
} from "@/services/llama/LlamaContext"
import { pickModel } from "@/services/llama/LlamaFileUtils"
import { colors } from "@/theme/colorsDark"
import { Chat } from "@flyerhq/react-native-chat-ui"
import { ChatBubble } from "./ChatBubble"
import { monoTheme } from "./ChatTheme"

import type { MessageType } from '@flyerhq/react-native-chat-ui'
import type { ChatMessage } from '@/services/llama/LlamaTypes'

const randId = () => Math.random().toString(36).substr(2, 9)
const user = { id: 'y9d7f8pgn' }
const systemId = 'h3o3lc5xj'
const system = { id: systemId }
const systemMessage = SYSTEM_MESSAGE
const defaultConversationId = 'default'

export const ChatContainer = observer(function ChatContainer() {
  const messageHandler = useMessageHandler()
  const { modelStore } = useStores()
  const context = modelStore.context

  const [inferencing, setInferencing] = useState<boolean>(false)
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const conversationIdRef = useRef<string>(defaultConversationId)

  const addMessage = React.useCallback((message: MessageType.Any, batching = false) => {
    if (batching) {
      setMessages([message, ...messages])
    } else {
      setMessages((msgs) => [message, ...msgs])
    }
  }, [messages])

  const addSystemMessage = React.useCallback((text: string, metadata = {}) => {
    const textMessage: ChatMessage = {
      author: system,
      createdAt: Date.now(),
      id: randId(),
      text,
      type: 'text',
      metadata: { system: true, ...metadata },
    }
    addMessage(textMessage)
    return textMessage.id
  }, [addMessage])

  const handleModelInit = async () => {
    const modelFile = await pickModel(addSystemMessage)
    if (!modelFile) return

    await handleContextRelease(
      context,
      () => {
        modelStore.setContext(null)
        addSystemMessage('Context released!')
      },
      (err) => addSystemMessage(`Context release failed: ${err}`)
    )

    await getModelInfo(modelFile.uri)
    const msgId = addSystemMessage('Initializing context...')

    const t0 = Date.now()
    try {
      const ctx = await initializeLlamaContext(
        modelFile,
        null,
        (progress) => {
          setMessages((msgs) => {
            const index = msgs.findIndex((msg) => msg.id === msgId)
            if (index >= 0) {
              return msgs.map((msg, i) => {
                if (msg.type === 'text' && i === index) {
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
      modelStore.setContext(ctx)
      addSystemMessage(
        `Context initialized!\n\nLoad time: ${t1 - t0}ms\nGPU: ${ctx.gpu ? 'YES' : 'NO'
        } (${ctx.reasonNoGPU})\nChat Template: ${ctx.model.isChatTemplateSupported ? 'YES' : 'NO'
        }\n\n` +
        'You can use the following commands:\n\n' +
        '- /info: to get the model info\n' +
        '- /bench: to benchmark the model\n' +
        '- /release: release the context\n' +
        '- /stop: stop the current completion\n' +
        '- /reset: reset the conversation' +
        '- /save-session: save the session tokens\n' +
        '- /load-session: load the session tokens'
      )
    } catch (err: any) {
      addSystemMessage(`Context initialization failed: ${err.message}`)
    }
  }

  const handleSendPress = React.useCallback(async (message: MessageType.PartialText) => {
    if (!context) {
      addSystemMessage('Please load a model first')
      return
    }

    // Handle commands
    if (message.text.startsWith('/')) {
      const isCommand = await handleCommand(
        message.text,
        context,
        inferencing,
        addSystemMessage,
        () => {
          conversationIdRef.current = randId()
        }
      )
      if (isCommand) return
    }

    // Handle regular messages
    const textMessage: ChatMessage = {
      author: user,
      createdAt: Date.now(),
      id: randId(),
      text: message.text,
      type: 'text',
      metadata: {
        contextId: context?.id,
        conversationId: conversationIdRef.current,
      },
    }

    const id = randId()
    const createdAt = Date.now()
    const msgs = [
      systemMessage,
      ...[...messages]
        .reverse()
        .map((msg) => {
          if (
            !msg.metadata?.system &&
            msg.metadata?.conversationId === conversationIdRef.current &&
            msg.metadata?.contextId === context?.id &&
            msg.type === 'text'
          ) {
            return {
              role: msg.author.id === systemId ? 'assistant' : 'user',
              content: msg.text,
            }
          }
          return { role: '', content: '' }
        })
        .filter((msg) => msg.role),
      { role: 'user', content: message.text },
    ]

    addMessage(textMessage)
    setInferencing(true)

    try {
      const formattedChat = (await context?.getFormattedChat(msgs)) || ''
      const { tokens } = (await context?.tokenize(formattedChat)) || {}
      console.log(
        'Formatted:',
        `"${formattedChat}"`,
        // '\nTokenize:',
        // tokens,
        `(${tokens?.length} tokens)`,
      )

      const completionResult = await context?.completion(
        {
          messages: msgs,
          n_predict: 1000,
          seed: -1,
          n_probs: 0,
          top_k: 40,
          top_p: 0.5,
          min_p: 0.05,
          temperature: 0.7,
          penalty_last_n: 64,
          penalty_repeat: 1.0,
          stop: [
            '</s>',
            '<|end|>',
            '<|im_end|>',
            '<|EOT|>',
            '<|end_of_turn|>',
            '<|endoftext|>',
          ],
        },
        (data) => {
          const { token } = data
          setMessages((msgs) => {
            const index = msgs.findIndex((msg) => msg.id === id)
            if (index >= 0) {
              return msgs.map((msg, i) => {
                if (msg.type === 'text' && i === index) {
                  return {
                    ...msg,
                    text: (msg.text + token).replace(/^\\s+/, ''),
                  }
                }
                return msg
              })
            }
            return [
              {
                author: system,
                createdAt,
                id,
                text: token,
                type: 'text',
                metadata: {
                  contextId: context?.id,
                  conversationId: conversationIdRef.current,
                },
              },
              ...msgs,
            ]
          })
        },
      )

      if (completionResult) {
        const timings = `${completionResult.timings.predicted_per_token_ms.toFixed()}ms per token, ${completionResult.timings.predicted_per_second.toFixed(2)} tokens per second`
        setMessages((msgs) => {
          const index = msgs.findIndex((msg) => msg.id === id)
          if (index >= 0) {
            return msgs.map((msg, i) => {
              if (msg.type === 'text' && i === index) {
                return {
                  ...msg,
                  metadata: {
                    ...msg.metadata,
                    timings,
                  },
                }
              }
              return msg
            })
          }
          return msgs
        })
      }
    } catch (e: any) {
      console.log('completion error: ', e)
      addSystemMessage(`Completion failed: ${e.message}`)
    } finally {
      setInferencing(false)
    }
  }, [context, addMessage, setInferencing, addSystemMessage, conversationIdRef, messages])

  React.useEffect(() => {
    messageHandler.setHandleMessage(handleSendPress)
  }, [handleSendPress])

  const llamaChat = useLlamaChat()
  React.useEffect(() => {
    llamaChat.setAddMessageCallback(addMessage)
    llamaChat.setMessages(messages)
  }, [messages])

  return (
    <SafeAreaProvider>
      <Chat
        renderBubble={({ child, message }) => (
          <ChatBubble child={child} message={message} />
        )}
        theme={monoTheme}
        messages={messages}
        onSendPress={handleSendPress}
        user={{ id: 'user' }}
        onAttachmentPress={!context ? handleModelInit : undefined}
        flatListProps={{
          marginBottom: 60
        }}
        textInputProps={{
          editable: true,
          placeholder: !context
            ? 'Load model to start chatting'
            : 'Type your message here',
          style: {
            color: colors.palette.neutral800,
            backgroundColor: colors.palette.neutral200,
          }
        }}
      />
    </SafeAreaProvider>
  )
})

// ChatContainer.tsx

import json5 from "json5"
import { initLlama, loadLlamaModelInfo } from "llama.rn"
import React, { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator, Alert, Platform, Pressable, Text, View
} from "react-native"
import ReactNativeBlobUtil from "react-native-blob-util"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { typography } from "@/theme"
import { monoTheme } from "@/theme/chat"
import { ModelDownloader } from "@/utils/ModelDownloader"
import { Chat } from "@flyerhq/react-native-chat-ui"
import { Bubble } from "./Bubble"
import {
  DEFAULT_MODEL, defaultConversationId, randId, system, systemId,
  systemMessage, user
} from "./constants"
import { addMessage, addSystemMessage, handleReleaseContext } from "./utils"

import type { DocumentPickerResponse } from 'react-native-document-picker'
import type { MessageType } from '@flyerhq/react-native-chat-ui'
import type { LlamaContext } from 'llama.rn'

const { dirs } = ReactNativeBlobUtil.fs

export default function ChatContainer() {
  const [context, setContext] = useState<LlamaContext | undefined>(undefined)
  const [inferencing, setInferencing] = useState<boolean>(false)
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [downloading, setDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [initializing, setInitializing] = useState<boolean>(true) // Check model on load

  const conversationIdRef = useRef<string>(defaultConversationId)
  const downloader = new ModelDownloader()

  const renderBubble = ({
    child,
    message,
  }: {
    child: React.ReactNode
    message: MessageType.Any
  }) => <Bubble child={child} message={message} />

  const getModelInfo = async (model: string) => {
    const t0 = Date.now()
    const info = await loadLlamaModelInfo(model)
    console.log(`Model info (took ${Date.now() - t0}ms): `, info)
  }

  const handleInitContext = async (file: DocumentPickerResponse) => {
    await handleReleaseContext(context, setContext, setMessages, messages, addSystemMessage)
    await getModelInfo(file.uri)
    const msgId = addSystemMessage(setMessages, messages, 'Initializing context...')
    const t0 = Date.now()
    initLlama(
      {
        model: file.uri,
        use_mlock: true,
        n_gpu_layers: Platform.OS === 'ios' ? 99 : 0,
      },
      (progress) => {
        setMessages((msgs) => {
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
      },
    )
      .then((ctx) => {
        const t1 = Date.now()
        setContext(ctx)
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
      })
      .catch((err) => {
        addSystemMessage(setMessages, [], `Context initialization failed: ${err.message}`)
      })
      .finally(() => {
        setInitializing(false)
      })
  }

  const handleDownloadModelConfirmed = async () => {
    if (downloading) return
    setDownloadProgress(0)
    setDownloading(true)
    try {
      addSystemMessage(setMessages, messages, `Downloading model from Hugging Face...`)
      const file = await downloader.downloadModel(
        DEFAULT_MODEL.repoId,
        DEFAULT_MODEL.filename,
        (progress) => {
          setDownloadProgress(progress)
        }
      )
      addSystemMessage(setMessages, [], `Model downloaded! Initializing...`)
      await handleInitContext(file)
    } catch (e: any) {
      addSystemMessage(setMessages, [], `Download failed: ${e.message}`)
    } finally {
      setDownloading(false)
    }
  }

  const confirmDownload = () => {
    Alert.alert(
      "Download Model?",
      `This model file may be large and is hosted here:\n\nhttps://huggingface.co/${DEFAULT_MODEL.repoId}/resolve/main/${DEFAULT_MODEL.filename}\n\nIt's recommended to download over Wi-Fi to avoid large data usage.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Download", onPress: handleDownloadModelConfirmed },
      ],
      { cancelable: true }
    )
  }

  const handleSendPress = async (message: MessageType.PartialText) => {
    if (context) {
      switch (message.text) {
        case '/info':
          addSystemMessage(
            setMessages,
            messages,
            `// Model Info\n${json5.stringify(context.model, null, 2)}`,
            { copyable: true },
          )
          return
        case '/release':
          await handleReleaseContext(context, setContext, setMessages, messages, addSystemMessage)
          return
        case '/stop':
          if (inferencing) context.stopCompletion()
          return
        case '/reset':
          conversationIdRef.current = randId()
          addSystemMessage(setMessages, [], 'Conversation reset!')
          return
        case '/save-session':
          context
            .saveSession(`${dirs.DocumentDir}/llama-session.bin`)
            .then((tokensSaved) => {
              console.log('Session tokens saved:', tokensSaved)
              addSystemMessage(setMessages, [], `Session saved! ${tokensSaved} tokens saved.`)
            })
            .catch((e) => {
              console.log('Session save failed:', e)
              addSystemMessage(setMessages, [], `Session save failed: ${e.message}`)
            })
          return
        case '/load-session':
          context
            .loadSession(`${dirs.DocumentDir}/llama-session.bin`)
            .then((details) => {
              console.log('Session loaded:', details)
              addSystemMessage(
                setMessages,
                [],
                `Session loaded! ${details.tokens_loaded} tokens loaded.`,
              )
            })
            .catch((e) => {
              console.log('Session load failed:', e)
              addSystemMessage(setMessages, [], `Session load failed: ${e.message}`)
            })
          return
      }
    }

    // Normal user message
    const textMessage: MessageType.Text = {
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

    addMessage(setMessages, messages, textMessage)
    setInferencing(true)

    const formattedChat = (await context?.getFormattedChat(msgs)) || ''
    const t0 = Date.now()
    const { tokens } = (await context?.tokenize(formattedChat)) || {}
    const t1 = Date.now()
    console.log(
      'Formatted:',
      `"${formattedChat}"`,
      '\nTokenize:',
      tokens,
      `(${tokens?.length} tokens, ${t1 - t0}ms})`,
    )

    let grammar: any = undefined

    context
      ?.completion(
        {
          messages: msgs,
          n_predict: 1500, // Increased to 1500
          grammar,
          seed: -1,
          n_probs: 0,

          top_k: 40,
          top_p: 0.5,
          min_p: 0.05,
          xtc_probability: 0.5,
          xtc_threshold: 0.1,
          typical_p: 1.0,
          temperature: 0.7,
          penalty_last_n: 64,
          penalty_repeat: 1.0,
          penalty_freq: 0.0,
          penalty_present: 0.0,
          dry_multiplier: 0,
          dry_base: 1.75,
          dry_allowed_length: 2,
          dry_penalty_last_n: -1,
          dry_sequence_breakers: ['\n', ':', '"', '*'],
          mirostat: 0,
          mirostat_tau: 5,
          mirostat_eta: 0.1,
          penalize_nl: false,
          ignore_eos: false,
          stop: [
            '</s>',
            '<|end|>',
            '<|eot_id|>',
            '<|end_of_text|>',
            '<|im_end|>',
            '<|EOT|>',
            '<|END_OF_TURN_TOKEN|>',
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
                if (msg.type == 'text' && i === index) {
                  return {
                    ...msg,
                    text: (msg.text + token).replace(/^\s+/, ''),
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
      .then((completionResult) => {
        console.log('completionResult: ', completionResult)
        const timings = `${completionResult.timings.predicted_per_token_ms.toFixed()}ms per token, ${completionResult.timings.predicted_per_second.toFixed(
          2,
        )} tokens per second`
        setMessages((msgs) => {
          const index = msgs.findIndex((msg) => msg.id === id)
          if (index >= 0) {
            return msgs.map((msg, i) => {
              if (msg.type == 'text' && i === index) {
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
        setInferencing(false)
      })
      .catch((e) => {
        console.log('completion error: ', e)
        setInferencing(false)
        addSystemMessage(setMessages, [], `Completion failed: ${e.message}`)
      })
  }

  // On mount, check if model already downloaded
  useEffect(() => {
    (async () => {
      const filePath = `${downloader.cacheDir}/${DEFAULT_MODEL.filename}`
      const exists = await ReactNativeBlobUtil.fs.exists(filePath)
      if (exists) {
        // Model already downloaded, initialize immediately
        addSystemMessage(setMessages, [], 'Model found locally, initializing...')
        await handleInitContext({ uri: filePath } as DocumentPickerResponse)
      } else {
        // Model not found, allow user to download
        setInitializing(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SafeAreaProvider style={{ width: '100%' }}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Chat
          renderBubble={renderBubble}
          theme={monoTheme}
          messages={messages}
          onSendPress={handleSendPress}
          user={user}
          textInputProps={{
            editable: !!context,
            placeholder: !context
              ? 'Download a model to begin'
              : 'Type your message here',
          }}
        />
        {!context && !initializing && (
          <View style={{ padding: 10, backgroundColor: '#000' }}>
            <Pressable onPress={confirmDownload} disabled={downloading}>
              <View style={{ backgroundColor: '#444', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: typography.primary.normal }}>
                  {downloading ? `Downloading... ${downloadProgress}%` : 'Download & Load Model'}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
        {initializing && !context && (
          <View style={{ padding: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="white" />
            <Text style={{ color: 'white', fontFamily: typography.primary.normal, marginTop: 10 }}>
              Checking model...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  )
}

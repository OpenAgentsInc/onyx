import React, { useRef, useState, useEffect } from 'react'
import { View, Alert, Platform, Text, Pressable } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Chat } from '@flyerhq/react-native-chat-ui'
import { monoTheme } from '@/theme/chat'
import { typography } from '@/theme'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { defaultConversationId, user } from './constants'
import { ModelSelector } from './components/ModelSelector'
import { LoadingIndicator } from './components/LoadingIndicator'
import { ModelSwitcher } from './components/ModelSwitcher'
import { useModelContext } from './hooks/useModelContext'
import { useModelInitialization } from './hooks/useModelInitialization'
import { Bubble } from './Bubble'
import { useChatHandlers } from './hooks/useChatHandlers'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { addSystemMessage } from './utils'

import type { MessageType } from '@flyerhq/react-native-chat-ui'

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [initializing, setInitializing] = useState<boolean>(false) // Changed to false initially
  const [inferencing, setInferencing] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  
  const conversationIdRef = useRef<string>(defaultConversationId)
  const downloader = new ModelDownloader()

  const { context, setContext, handleInitContext } = useModelContext(setMessages, messages)
  const { handleSendPress } = useChatHandlers(context, conversationIdRef, setMessages, messages, setInferencing)
  const { status } = useModelStore()

  useModelInitialization(downloader, setMessages, setInitializing, handleInitContext)

  // Reset initializing state when status changes to error
  useEffect(() => {
    if (status === 'error') {
      setInitializing(false)
    }
  }, [status])

  const handleDownloadModelConfirmed = async () => {
    if (downloading) return
    setDownloadProgress(0)
    setDownloading(true)
    try {
      const currentModel = getCurrentModelConfig()
      addSystemMessage(setMessages, messages, `Downloading ${currentModel.displayName} from Hugging Face...`)
      const file = await downloader.downloadModel(
        currentModel.repoId,
        currentModel.filename
      )
      addSystemMessage(setMessages, [], `Model downloaded! Initializing...`)
      await handleInitContext(file)
    } catch (e: any) {
      if (e.message?.includes('cancelled') || e.message?.includes('background')) {
        addSystemMessage(
          setMessages,
          [],
          `Download cancelled because app was minimized. Please try again and keep the app in foreground during download.`
        )
      } else {
        addSystemMessage(setMessages, [], `Download failed: ${e.message}`)
      }
    } finally {
      setDownloading(false)
    }
  }

  const confirmDownload = () => {
    const currentModel = getCurrentModelConfig()
    const warningMessage = Platform.OS === 'ios'
      ? "Please do not minimize the app during download. The download will be cancelled if the app goes to background.\n\n"
      : "Please keep the app open during download. Minimizing the app may interrupt the download.\n\n";

    Alert.alert(
      "Download Model?",
      `${warningMessage}This model file may be large and is hosted here:\n\nhttps://huggingface.co/${currentModel.repoId}/resolve/main/${currentModel.filename}\n\nIt's recommended to download over Wi-Fi to avoid large data usage.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Download", onPress: handleDownloadModelConfirmed },
      ],
      { cancelable: true }
    )
  }

  const renderBubble = ({
    child,
    message,
  }: {
    child: React.ReactNode
    message: MessageType.Any
  }) => <Bubble child={child} message={message} />

  // Show model selector when:
  // 1. No context (no model loaded)
  // 2. OR when we're in idle/error state
  const showModelSelector = !context || status === 'idle' || status === 'error'

  return (
    <SafeAreaProvider style={{ width: '100%' }}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Model switcher floating button */}
        {!showModelSelector && (
          <View style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            pointerEvents: 'box-none',
          }}>
            <SafeAreaView edges={['top']} style={{ 
              backgroundColor: 'transparent',
              pointerEvents: 'box-none',
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'flex-end',
                padding: 8,
                paddingTop: 12,
                paddingBottom: 12,
                pointerEvents: 'box-none',
              }}>
                <View style={{ pointerEvents: 'auto' }}>
                  <ModelSwitcher />
                </View>
              </View>
            </SafeAreaView>
          </View>
        )}

        {/* Main content */}
        <View style={{ flex: 1 }}>
          {/* Model selection UI */}
          {showModelSelector ? (
            <View style={{ flex: 1 }}>
              <ModelSelector />
              {/* Download button */}
              <View style={{ 
                padding: 10, 
                paddingBottom: 50, 
                backgroundColor: '#000',
                alignItems: 'center',
              }}>
                <Pressable 
                  onPress={confirmDownload}
                  disabled={downloading || initializing}
                  style={{ 
                    backgroundColor: '#444', 
                    padding: 15,
                    paddingHorizontal: 30,
                    borderRadius: 25,
                    opacity: (downloading || initializing) ? 0.7 : 1,
                  }}
                >
                  <Text style={{ 
                    color: 'white', 
                    textAlign: 'center', 
                    fontFamily: typography.primary.normal,
                    fontSize: 16,
                  }}>
                    {downloading ? `Downloading... ${downloadProgress}%` : 
                     initializing ? 'Initializing...' :
                     'Download Selected Model'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* Chat interface */
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
          )}
        </View>

        {/* Loading indicator */}
        {initializing && <LoadingIndicator />}
      </View>
    </SafeAreaProvider>
  )
}
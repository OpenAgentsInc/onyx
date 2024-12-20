import React, { useRef, useState, useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Chat } from '@flyerhq/react-native-chat-ui'
import { monoTheme } from '@/theme/chat'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { defaultConversationId, user } from './constants'
import { LoadingIndicator } from './components/LoadingIndicator'
import { ModelSwitcher } from './components/ModelSwitcher'
import { DownloadScreen } from './components/DownloadScreen'
import { useModelContext } from './hooks/useModelContext'
import { useModelInitialization } from './hooks/useModelInitialization'
import { Bubble } from './Bubble'
import { useChatHandlers } from './hooks/useChatHandlers'
import { useModelStore } from '@/store/useModelStore'

import type { MessageType } from '@flyerhq/react-native-chat-ui'

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [initializing, setInitializing] = useState<boolean>(false)
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
          {showModelSelector ? (
            <DownloadScreen
              downloading={downloading}
              initializing={initializing}
              downloadProgress={downloadProgress}
              setDownloading={setDownloading}
              setDownloadProgress={setDownloadProgress}
              setMessages={setMessages}
              messages={messages}
              handleInitContext={handleInitContext}
            />
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
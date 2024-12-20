import React, { useRef, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Chat } from '@flyerhq/react-native-chat-ui'
import { monoTheme } from '@/theme/chat'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { defaultConversationId, user } from './constants'
import { ModelSelector } from './components/ModelSelector'
import { DownloadButton } from './components/DownloadButton'
import { LoadingIndicator } from './components/LoadingIndicator'
import { useModelContext } from './hooks/useModelContext'
import { useModelDownload } from './hooks/useModelDownload'
import { useModelInitialization } from './hooks/useModelInitialization'
import { Bubble } from './Bubble'
import { useChatHandlers } from './hooks/useChatHandlers'

import type { MessageType } from '@flyerhq/react-native-chat-ui'

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [initializing, setInitializing] = useState<boolean>(true)
  const [inferencing, setInferencing] = useState<boolean>(false)
  
  const conversationIdRef = useRef<string>(defaultConversationId)
  const downloader = new ModelDownloader()

  const { context, setContext, handleInitContext } = useModelContext(setMessages, messages)
  const { confirmDownload } = useModelDownload(downloader, setMessages, messages, handleInitContext)
  const { handleSendPress } = useChatHandlers(context, conversationIdRef, setMessages, messages, setInferencing)

  useModelInitialization(downloader, setMessages, setInitializing, handleInitContext)

  const renderBubble = ({
    child,
    message,
  }: {
    child: React.ReactNode
    message: MessageType.Any
  }) => <Bubble child={child} message={message} />

  return (
    <SafeAreaProvider style={{ width: '100%' }}>
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
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
          <>
            <ModelSelector />
            <DownloadButton onPress={confirmDownload} />
          </>
        )}
        {initializing && !context && <LoadingIndicator />}
      </View>
    </SafeAreaProvider>
  )
}
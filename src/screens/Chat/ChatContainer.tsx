import React, { useEffect, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useModelStore } from "@/store/useModelStore"
import { typography } from "@/theme"
import { monoTheme } from "@/theme/chat"
import { colors } from "@/theme/colors"
import { ModelDownloader } from "@/utils/ModelDownloader"
import { Chat } from "@flyerhq/react-native-chat-ui"
import { Bubble } from "./Bubble"
import { LoadingIndicator } from "./components/LoadingIndicator"
import { ModelFileManager } from "./components/ModelFileManager"
import { AVAILABLE_MODELS, defaultConversationId, user } from "./constants"
import { useChatHandlers } from "./hooks/useChatHandlers"
import { useModelContext } from "./hooks/useModelContext"
import { useModelInitialization } from "./hooks/useModelInitialization"

import type { MessageType } from '@flyerhq/react-native-chat-ui'

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [initializing, setInitializing] = useState<boolean>(true) // Start as true
  const [inferencing, setInferencing] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [showModelManager, setShowModelManager] = useState<boolean>(false)

  const conversationIdRef = useRef<string>(defaultConversationId)
  const downloader = new ModelDownloader()

  const { context, setContext, handleInitContext } = useModelContext(setMessages, messages)
  const { handleSendPress } = useChatHandlers(context, conversationIdRef, setMessages, messages, setInferencing)
  const { status, progress } = useModelStore()

  useModelInitialization(downloader, setMessages, setInitializing, handleInitContext)

  // Reset initializing state when status changes to error or ready
  useEffect(() => {
    if (status === 'error' || status === 'ready') {
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

  // Show loading indicator during initialization or when explicitly initializing a model
  const showLoadingIndicator = initializing || status === 'initializing'

  // Show download progress when downloading
  const showDownloadProgress = status === 'downloading'

  const handleDownloadModel = async (modelKey: string) => {
    setShowModelManager(false) // Close the modal
    setDownloading(true)
    setDownloadProgress(0)
    try {
      const currentModel = AVAILABLE_MODELS[modelKey]
      const file = await downloader.downloadModel(
        currentModel.repoId,
        currentModel.filename
      )
      await handleInitContext(file)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <SafeAreaProvider style={{ width: '100%' }}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Model manager button - only show when not initializing */}
        {!showLoadingIndicator && !showDownloadProgress && (
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
                <TouchableOpacity
                  onPress={() => setShowModelManager(true)}
                  style={{
                    backgroundColor: colors.palette.neutral200,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: colors.text,
                    fontFamily: typography.primary.medium,
                    fontSize: 14,
                  }}>
                    Models
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        )}

        {/* Main content */}
        <View style={{ flex: 1 }}>
          <Chat
            renderBubble={renderBubble}
            theme={monoTheme}
            messages={messages}
            onSendPress={handleSendPress}
            user={user}
            textInputProps={{
              editable: !!context,
              placeholder: !context ? 'Download a model to begin' : 'Type your message here',
              onPressIn: !context ? () => setShowModelManager(true) : undefined,
            }}
          />
        </View>

        {/* Loading indicator */}
        {showLoadingIndicator && (
          <LoadingIndicator message="Initializing model..." />
        )}

        {/* Download progress */}
        {showDownloadProgress && (
          <LoadingIndicator
            message="Downloading model"
            progress={progress}
          />
        )}

        {/* Model manager modal - only show when not initializing or downloading */}
        {!showLoadingIndicator && !showDownloadProgress && (
          <ModelFileManager
            visible={showModelManager}
            onClose={() => setShowModelManager(false)}
            onDownloadModel={handleDownloadModel}
          />
        )}
      </View>
    </SafeAreaProvider>
  )
}
import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Chat, Theme } from '@flyerhq/react-native-chat-ui'
import type { MessageType } from '@flyerhq/react-native-chat-ui'
import DocumentPicker from 'react-native-document-picker'
import { Platform, View } from 'react-native'
import type { LlamaContext } from 'llama.rn'
import { Bubble } from '@/components/Bubble'
import { useChat } from '@/features/llama/hooks/useChat'
import { useModelDownload } from '@/features/llama/hooks/useModelDownload'
import { DEFAULT_MODEL } from '@/features/llama/constants'
import { ModelManager } from '@/features/llama/ModelManager'
import { colors } from '@/theme/colorsDark'

// Custom theme using monochrome colors
const monoTheme: Theme = {
  colors: {
    primary: colors.palette.neutral800, // Light text
    secondary: colors.palette.neutral600, // Dimmed text
    background: colors.palette.neutral100, // Dark background
    inputBackground: colors.palette.neutral200, // Input background
    inputText: colors.palette.neutral800, // Input text
    error: colors.palette.neutral600, // Error messages
    userAvatarBackground: colors.palette.neutral300,
    userAvatarText: colors.palette.neutral100,
    receivedMessageDocumentIcon: colors.palette.neutral600,
    receivedMessageText: colors.palette.neutral800,
    receivedMessageTextLink: colors.palette.neutral600,
    receivedMessageTimestamp: colors.palette.neutral500,
    sentMessageDocumentIcon: colors.palette.neutral300,
    sentMessageText: colors.palette.neutral100,
    sentMessageTextLink: colors.palette.neutral300,
    sentMessageTimestamp: colors.palette.neutral400,
    sentMessageBackground: colors.palette.neutral300,
    receivedMessageBackground: colors.palette.neutral700,
    typingIndicator: colors.palette.neutral600,
  },
  borders: {
    inputBorderRadius: 20,
    messageBorderRadius: 20,
  },
  fonts: {
    bodyText: undefined,
    bodyTextStyle: {},
    captionText: undefined,
    captionTextStyle: {},
  },
  insets: {
    messageInsetsHorizontal: 12,
    messageInsetsVertical: 12,
  }
}

const renderBubble = ({ child, message }) => (
  <Bubble child={child} message={message} />
)

const BottomPadding = () => (
  <View style={{ height: 80 }} />
)

export function LlamaRNExample() {
  const [context, setContext] = useState<LlamaContext | null>(null)
  const { messages, inferencing, addSystemMessage, handleCompletion } = useChat()
  const { downloadAndInitModel, downloadProgress, initProgress, error } = useModelDownload()

  // Handle model file picking
  const handlePickModel = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: Platform.OS === 'ios' ? 'public.data' : 'application/octet-stream'
      })
      if (!result?.[0]) return

      addSystemMessage('Loading selected model...')
      const modelManager = new ModelManager()
      const { context, loadTimeMs } = await modelManager.initializeModel(
        result[0],
        null,
        (progress) => addSystemMessage(`Initializing model... ${progress}%`)
      )
      
      setContext(context)
      addSystemMessage(`Model loaded in ${loadTimeMs}ms!`)
    } catch (err: any) {
      console.error('Model loading failed:', err)
      addSystemMessage(`Failed to load model: ${err.message}`)
    }
  }

  // Handle message sending
  const handleSendPress = async (message: MessageType.PartialText) => {
    if (!context) {
      if (message.text === '/download') {
        try {
          addSystemMessage('Starting model download...')
          const newContext = await downloadAndInitModel(
            DEFAULT_MODEL.repoId,
            DEFAULT_MODEL.filename
          )
          setContext(newContext)
          addSystemMessage('Model ready! You can start chatting.')
        } catch (err: any) {
          addSystemMessage(`Download failed: ${err.message}`)
        }
        return
      }
      addSystemMessage('Please load a model first using the file icon or type /download')
      return
    }

    // Handle other commands
    switch (message.text) {
      case '/info':
        addSystemMessage(
          `Model Info:\n${JSON.stringify(context.model, null, 2)}`,
          { copyable: true }
        )
        return
      case '/release':
        await context.release()
        setContext(null)
        addSystemMessage('Model released')
        return
      default:
        await handleCompletion(context, message.text)
    }
  }

  // Show download progress
  React.useEffect(() => {
    if (downloadProgress) {
      const { percentage, received, total } = downloadProgress
      const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)
      addSystemMessage(
        `Downloading: ${percentage}% (${mb(received)}MB / ${mb(total)}MB)`,
        { progress: true }
      )
    }
  }, [downloadProgress])

  // Show initialization progress
  React.useEffect(() => {
    if (initProgress) {
      addSystemMessage(`Initializing model... ${initProgress}%`)
    }
  }, [initProgress])

  // Show errors
  React.useEffect(() => {
    if (error) {
      addSystemMessage(`Error: ${error}`)
    }
  }, [error])

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.palette.neutral100 }}>
        <Chat
          renderBubble={renderBubble}
          theme={monoTheme}
          messages={messages}
          onSendPress={handleSendPress}
          user={{ id: 'user' }}
          onAttachmentPress={!context ? handlePickModel : undefined}
          textInputProps={{
            editable: true,
            placeholder: !context
              ? 'Type /download or press file icon to load model'
              : 'Type your message here',
            style: {
              color: colors.palette.neutral800,
              backgroundColor: colors.palette.neutral200,
            }
          }}
          customBottomComponent={BottomPadding}
        />
      </View>
    </SafeAreaProvider>
  )
}
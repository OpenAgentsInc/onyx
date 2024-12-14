import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Chat, darkTheme } from '@flyerhq/react-native-chat-ui'
import DocumentPicker from 'react-native-document-picker'
import { Platform } from 'react-native'
import type { LlamaContext } from 'llama.rn'
import { Bubble } from '@/components/Bubble'
import { useChat } from '@/features/llama/hooks/useChat'
import { useModelDownload } from '@/features/llama/hooks/useModelDownload'
import { DEFAULT_MODEL } from '@/features/llama/constants'
import { ModelManager } from '@/features/llama/ModelManager'

const renderBubble = ({ child, message }) => (
  <Bubble child={child} message={message} />
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
      <Chat
        renderBubble={renderBubble}
        theme={darkTheme}
        messages={messages}
        onSendPress={handleSendPress}
        user={{ id: 'user' }}
        onAttachmentPress={!context ? handlePickModel : undefined}
        textInputProps={{
          editable: true,
          placeholder: !context
            ? 'Type /download or press file icon to load model'
            : 'Type your message here'
        }}
      />
    </SafeAreaProvider>
  )
}
import React from 'react'
import { View, Text, Alert, Platform, StyleSheet, ScrollView } from 'react-native'
import { typography } from '@/theme'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { getCurrentModelConfig } from '@/store/useModelStore'
import { addSystemMessage } from '../utils'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { ModelSelector } from './ModelSelector'
import { ModelFileManager } from './ModelFileManager'
import type { MessageType } from '@flyerhq/react-native-chat-ui'

interface DownloadScreenProps {
  downloading: boolean
  initializing: boolean
  downloadProgress: number
  setDownloading: (downloading: boolean) => void
  setDownloadProgress: (progress: number) => void
  setMessages: React.Dispatch<React.SetStateAction<MessageType.Any[]>>
  messages: MessageType.Any[]
  handleInitContext: (file: any) => Promise<void>
}

export function DownloadScreen({
  downloading,
  initializing,
  downloadProgress,
  setDownloading,
  setDownloadProgress,
  setMessages,
  messages,
  handleInitContext,
}: DownloadScreenProps) {
  const downloader = new ModelDownloader()

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
      ? "Please do not minimize the app during download. The download will be cancelled if the app goes to background.\\n\\n"
      : "Please keep the app open during download. Minimizing the app may interrupt the download.\\n\\n";

    Alert.alert(
      "Download Model?",
      `${warningMessage}This model file may be large and is hosted here:\\n\\nhttps://huggingface.co/${currentModel.repoId}/resolve/main/${currentModel.filename}\\n\\nIt's recommended to download over Wi-Fi to avoid large data usage.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Download", onPress: handleDownloadModelConfirmed },
      ],
      { cancelable: true }
    )
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Agents Section */}
        <Card title="Available Models">
          <ModelSelector />
        </Card>

        {/* Files Section */}
        <Card title="Model Files">
          <ModelFileManager />
        </Card>

        {/* Download Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={confirmDownload}
            isDisabled={downloading || initializing}
            theme="PRIMARY"
          >
            {downloading ? `Downloading... ${downloadProgress}%` : 
             initializing ? 'Initializing...' :
             'Download Selected Model'}
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    padding: 16,
    backgroundColor: '#000',
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
})
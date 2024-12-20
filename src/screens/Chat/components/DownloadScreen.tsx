import React from 'react'
import { View, Text, Alert, Platform, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { typography } from '@/theme'
import { colors } from '@/theme/colors'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { getCurrentModelConfig, useModelStore } from '@/store/useModelStore'
import { addSystemMessage } from '../utils'
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
  setDownloading,
  setDownloadProgress,
  setMessages,
  messages,
  handleInitContext,
}: DownloadScreenProps) {
  const downloader = new ModelDownloader()
  const { status, progress, errorMessage, reset } = useModelStore()

  const handleDownloadModelConfirmed = async () => {
    if (downloading) return
    setDownloading(true)
    setDownloadProgress(0)
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
      // Reset store state on error
      reset()
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

  const getButtonText = () => {
    if (status === 'downloading') {
      return `Downloading... ${progress}%`
    }
    if (status === 'initializing') {
      return 'Initializing...'
    }
    if (status === 'error') {
      return 'Retry Download'
    }
    return 'Download Selected Model'
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Models Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Models</Text>
          <View style={styles.card}>
            <ModelSelector />
          </View>
        </View>

        {/* Files Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model Files</Text>
          <View style={styles.card}>
            <ModelFileManager />
          </View>
        </View>

        {/* Error Message */}
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Download Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={confirmDownload}
            disabled={status === 'downloading' || status === 'initializing'}
            style={[
              styles.button,
              (status === 'downloading' || status === 'initializing') && styles.buttonDisabled,
              status === 'error' && styles.buttonError
            ]}
          >
            <Text style={styles.buttonText}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.medium,
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.palette.neutral200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorContainer: {
    backgroundColor: colors.errorBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: typography.primary.normal,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 8,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: colors.palette.primary500,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.palette.neutral300,
  },
  buttonError: {
    backgroundColor: colors.errorBackground,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
})
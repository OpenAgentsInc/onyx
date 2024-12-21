import React from "react"
import {
  Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from "react-native"
import { getCurrentModelConfig, useModelStore } from "@/store/useModelStore"
import { typography } from "@/theme"
import { colors } from "@/theme/colors"
import { ModelDownloader } from "@/utils/ModelDownloader"
import { addSystemMessage } from "../utils"
import { LoadingIndicator } from "./LoadingIndicator"
import { ModelFileManager } from "./ModelFileManager"

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
  const { status, progress } = useModelStore()

  const handleDownloadModel = async (modelKey: string) => {
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
        { text: "Download", onPress: handleDownloadModel },
      ],
      { cancelable: true }
    )
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Models Section */}
        <View style={styles.section}>
          <View style={{ marginTop: 50 }} />
          <Text style={styles.sectionTitle}>Select a model to chat with</Text>
          <Text style={styles.sectionSubtitle}>Your model will take ~2 minutes to download. Make sure you are on wi-fi.</Text>
          <View style={styles.card}>
            <ModelFileManager
              visible={true}
              onClose={() => { }}
              onDownloadModel={handleDownloadModel}
              embedded={true}
            />
          </View>
        </View>
      </View>

      {/* Loading indicator */}
      {initializing && (
        <LoadingIndicator message="Initializing model" />
      )}

      {/* Download progress */}
      {/* {status === 'downloading' && (
        <LoadingIndicator
          message="Downloading model..."
          progress={progress}
        />
      )} */}
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
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    color: colors.textDim,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.palette.neutral200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
})

import { Platform } from 'react-native'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { getCurrentModelConfig } from '@/store/useModelStore'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { addSystemMessage } from '../utils'

export const useModelDownload = (
  downloader: ModelDownloader,
  setMessages: any,
  messages: any[],
  handleInitContext: (file: DocumentPickerResponse) => Promise<void>
) => {
  const handleDownloadModelConfirmed = async () => {
    try {
      const currentModel = getCurrentModelConfig()
      addSystemMessage(setMessages, messages, `Downloading model from Hugging Face...`)
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
    }
  }

  const confirmDownload = () => {
    const currentModel = getCurrentModelConfig()
    const warningMessage = Platform.OS === 'ios'
      ? "Please do not minimize the app during download. The download will be cancelled if the app goes to background.\n\n"
      : "Please keep the app open during download. Minimizing the app may interrupt the download.\n\n"

    return new Promise<void>((resolve) => {
      Alert.alert(
        "Download Model?",
        `${warningMessage}This model file may be large and is hosted here:\n\nhttps://huggingface.co/${currentModel.repoId}/resolve/main/${currentModel.filename}\n\nIt's recommended to download over Wi-Fi to avoid large data usage.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Download", onPress: () => resolve() },
        ],
        { cancelable: true }
      )
    }).then(handleDownloadModelConfirmed)
  }

  return { confirmDownload }
}
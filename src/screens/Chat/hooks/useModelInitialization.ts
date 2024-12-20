import { useEffect } from 'react'
import ReactNativeBlobUtil from 'react-native-blob-util'
import type { DocumentPickerResponse } from 'react-native-document-picker'
import { useModelStore, getCurrentModelConfig } from '@/store/useModelStore'
import { ModelDownloader } from '@/utils/ModelDownloader'
import { addSystemMessage } from '../utils'

export const useModelInitialization = (
  downloader: ModelDownloader,
  setMessages: any,
  setInitializing: (value: boolean) => void,
  handleInitContext: (file: DocumentPickerResponse) => Promise<void>
) => {
  const { selectedModelKey } = useModelStore()

  useEffect(() => {
    (async () => {
      const currentModel = getCurrentModelConfig()
      const filePath = `${downloader.cacheDir}/${currentModel.filename}`
      const exists = await ReactNativeBlobUtil.fs.exists(filePath)
      if (exists) {
        addSystemMessage(setMessages, [], 'Model found locally, initializing...')
        await handleInitContext({ uri: filePath } as DocumentPickerResponse)
      } else {
        setInitializing(false)
      }
    })()
  }, [selectedModelKey, downloader, setMessages, setInitializing, handleInitContext])
}
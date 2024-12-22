import * as FileSystem from "expo-file-system"
import { useCallback, useEffect } from "react"
import { Alert, AppState } from "react-native"
import { AVAILABLE_MODELS } from "@/screens/Chat/constants"
import { useModelStore } from "@/store/useModelStore"

const MODELS_DIR = `${FileSystem.cacheDirectory}models`

export const useModelDownload = () => {
  const {
    selectedModelKey,
    status,
    updateProgress,
    setModelPath,
    setError,
    cancelDownload,
  } = useModelStore()

  // Ensure models directory exists
  useEffect(() => {
    FileSystem.makeDirectoryAsync(MODELS_DIR, { intermediates: true }).catch(console.error)
  }, [])

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" && status === "downloading") {
        cancelDownload()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [status, cancelDownload])

  const startDownload = useCallback(async () => {
    const model = AVAILABLE_MODELS[selectedModelKey]
    if (!model) {
      setError("Invalid model selected")
      return
    }

    const size = selectedModelKey === "1B" ? "770 MB" : "1.9 GB"

    Alert.alert(
      "Download Model",
      `This will download ${model.displayName} (${size}). Please ensure:\n\n` +
      "• You're connected to Wi-Fi\n" +
      "• Your device has enough storage\n" +
      "• Keep the app open during download",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: async () => {
            try {
              // First set the store status to downloading
              const store = useModelStore.getState()
              store.startDownload()

              const tempPath = `${FileSystem.cacheDirectory}temp_${model.filename}`
              const finalPath = `${MODELS_DIR}/${model.filename}`

              // Create download
              const downloadResumable = FileSystem.createDownloadResumable(
                `https://huggingface.co/${model.repoId}/resolve/main/${model.filename}`,
                tempPath,
                {},
                (downloadProgress) => {
                  const progress =
                    (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
                  // Get fresh store instance to update progress
                  useModelStore.getState().updateProgress(progress)
                }
              )

              // Start download
              const { uri } = await downloadResumable.downloadAsync()

              // Validate file
              const fileInfo = await FileSystem.getInfoAsync(uri)
              if (!fileInfo.exists || fileInfo.size < 100 * 1024 * 1024) {
                throw new Error("Downloaded file is invalid or too small")
              }

              // Move to final location
              await FileSystem.moveAsync({
                from: uri,
                to: finalPath
              })

              // Update state with final path
              useModelStore.getState().setModelPath(finalPath)

            } catch (error: any) {
              console.error("Download error:", error)
              useModelStore.getState().setError(error.message || "Failed to download model")

              // Clean up temp file
              try {
                await FileSystem.deleteAsync(tempPath)
              } catch { }
            }
          }
        }
      ]
    )
  }, [selectedModelKey, setError, updateProgress, setModelPath])
  return { startDownload }
}
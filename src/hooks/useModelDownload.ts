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
    setModelPath,
    setError,
    cancelDownload,
    startDownload,
    updateProgress,
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

  const cleanupTempFile = async (tempPath: string) => {
    try {
      const tempFileInfo = await FileSystem.getInfoAsync(tempPath)
      if (tempFileInfo.exists) {
        await FileSystem.deleteAsync(tempPath)
      }
    } catch (cleanupError) {
      console.error("Error cleaning up temp file:", cleanupError)
    }
  }

  const startModelDownload = useCallback(async () => {
    const model = AVAILABLE_MODELS[selectedModelKey]
    if (!model) {
      setError("Invalid model selected")
      return
    }

    const size = selectedModelKey === "1B" ? "770 MB" : "1.9 GB"
    const tempPath = `${FileSystem.cacheDirectory}temp_${model.filename}`
    const finalPath = `${MODELS_DIR}/${model.filename}`
    let downloadResumable: FileSystem.DownloadResumable | null = null

    Alert.alert(
      "Download Model",
      `This will download ${model.displayName} (${size}). Please ensure:\n\n` +
      "• You're connected to Wi-Fi\n" +
      "• Your device has enough storage\n" +
      "• Keep the app open during download",
      [
        { 
          text: "Cancel", 
          style: "cancel",
          onPress: () => {
            if (downloadResumable) {
              downloadResumable.cancelAsync()
            }
            cleanupTempFile(tempPath)
          }
        },
        {
          text: "Download",
          onPress: async () => {
            try {
              // First set the store status to downloading
              startDownload()

              // Create download
              downloadResumable = FileSystem.createDownloadResumable(
                `https://huggingface.co/${model.repoId}/resolve/main/${model.filename}`,
                tempPath,
                {},
                (downloadProgress) => {
                  if (status === "downloading") { // Only update if still downloading
                    const progress = parseFloat(
                      ((downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100)
                      .toFixed(1)
                    )
                    updateProgress(progress)
                  }
                }
              )

              // Start download
              const result = await downloadResumable.downloadAsync()
              
              // If download was cancelled or failed
              if (!result?.uri) {
                await cleanupTempFile(tempPath)
                return
              }

              // Validate file
              const fileInfo = await FileSystem.getInfoAsync(result.uri)
              if (!fileInfo.exists || fileInfo.size < 100 * 1024 * 1024) {
                await cleanupTempFile(tempPath)
                throw new Error("Downloaded file is invalid or too small")
              }

              // Move to final location
              await FileSystem.moveAsync({
                from: result.uri,
                to: finalPath
              })

              // Update state with final path
              setModelPath(finalPath)

            } catch (error: any) {
              console.error("Download error:", error)
              setError(error.message || "Failed to download model")
              await cleanupTempFile(tempPath)
            } finally {
              downloadResumable = null
            }
          }
        }
      ]
    )
  }, [selectedModelKey, setError, updateProgress, setModelPath, startDownload, status])

  return { startDownload: startModelDownload }
}
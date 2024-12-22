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
    startModelDownload,
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
          onPress: () => {
            startModelDownload(selectedModelKey)
          }
        }
      ]
    )
  }, [selectedModelKey, setError, startModelDownload])

  return { startDownload }
}
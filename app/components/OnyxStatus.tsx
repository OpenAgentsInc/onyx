import React from "react"
import { View, ViewStyle, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text } from "@/components"
import { colorsDark } from "@/theme"
import { useModelDownload } from "@/features/llama/hooks/useModelDownload"
import { DEFAULT_MODEL } from "@/features/llama/constants"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"

export const OnyxStatus = observer(function OnyxStatus() {
  const { modelStore } = useStores()
  const { downloadAndInitModel } = useModelDownload()

  const handleDownload = async () => {
    try {
      modelStore.setIsDownloading(true)
      modelStore.setError(null)
      const context = await downloadAndInitModel(
        DEFAULT_MODEL.repoId,
        DEFAULT_MODEL.filename,
        (progress) => modelStore.setDownloadProgress(progress),
        (progress) => modelStore.setInitProgress(progress)
      )
      modelStore.setContext(context)
    } catch (err: any) {
      console.error('Download failed:', err)
      modelStore.setError(err.message)
    } finally {
      modelStore.setIsDownloading(false)
      modelStore.setDownloadProgress(null)
      modelStore.setInitProgress(null)
    }
  }

  return (
    <View style={$container}>
      <View style={$row}>
        <Text preset="default" style={$text}>
          {modelStore.statusText}
        </Text>
        {!modelStore.isLoading && !modelStore.context && !modelStore.error && (
          <TouchableOpacity onPress={handleDownload} style={$button}>
            <Text style={$buttonText}>Download Model</Text>
          </TouchableOpacity>
        )}
        {modelStore.isLoading && <ActivityIndicator style={$spinner} color="white" />}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  backgroundColor: "black",
  borderBottomColor: colorsDark.border,
  borderBottomWidth: 1,
  paddingVertical: 8,
  paddingHorizontal: 12,
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $text = {
  color: "white",
  flex: 1,
}

const $button = {
  backgroundColor: colorsDark.primary,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  marginLeft: 12,
}

const $buttonText = {
  color: "white",
  fontSize: 14,
}

const $spinner = {
  marginLeft: 12,
}
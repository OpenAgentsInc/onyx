import React from "react"
import { View, ViewStyle, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text } from "@/components"
import { colorsDark } from "@/theme"
import { useModelDownload } from "@/features/llama/hooks/useModelDownload"
import { DEFAULT_MODEL } from "@/features/llama/constants"

export function OnyxStatus() {
  const { downloadAndInitModel, downloadProgress, initProgress, error } = useModelDownload()

  const handleDownload = async () => {
    try {
      await downloadAndInitModel(DEFAULT_MODEL.repoId, DEFAULT_MODEL.filename)
    } catch (err: any) {
      console.error('Download failed:', err)
    }
  }

  const getStatusText = () => {
    if (error) return `Error: ${error}`
    if (downloadProgress) {
      const { percentage, received, total } = downloadProgress
      const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)
      return `Downloading: ${percentage}% (${mb(received)}MB / ${mb(total)}MB)`
    }
    if (initProgress) return `Initializing: ${initProgress}%`
    return 'Model not loaded'
  }

  const isLoading = !!downloadProgress || !!initProgress

  return (
    <View style={$container}>
      <View style={$row}>
        <Text preset="default" style={$text}>
          {getStatusText()}
        </Text>
        {!isLoading && !error && (
          <TouchableOpacity onPress={handleDownload} style={$button}>
            <Text style={$buttonText}>Download Model</Text>
          </TouchableOpacity>
        )}
        {isLoading && <ActivityIndicator style={$spinner} color="white" />}
      </View>
    </View>
  )
}

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
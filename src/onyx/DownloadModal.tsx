import React from "react"
import { Modal, StyleSheet, Text, View } from "react-native"
import { LoadingIndicator } from "@/screens/Chat/components/LoadingIndicator"
import { useModelStore } from "@/store/useModelStore"
import { typography } from "@/theme"
import { colors } from "@/theme/colors"

export const DownloadModal = () => {
  const { status, progress } = useModelStore()
  // const isVisible = status === "downloading" || status === "initializing"
  const isVisible = false

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}} // Empty function to prevent dismissal
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <LoadingIndicator
            message={status === "downloading" ? "Downloading model..." : "Initializing model..."}
            progress={status === "downloading" ? progress : undefined}
          />
          <Text style={styles.warning}>
            Please keep the app open during download.{"\n"}
            Minimizing the app will pause the download.
          </Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  warning: {
    marginTop: 20,
    color: colors.textDim,
    fontSize: 14,
    fontFamily: typography.primary.normal,
    textAlign: "center",
    lineHeight: 20,
  },
})

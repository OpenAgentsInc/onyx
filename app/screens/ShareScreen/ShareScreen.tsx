import { observer } from "mobx-react-lite"
import React from "react"
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import { colorsDark as colors } from "@/theme"
import { styles as baseStyles } from "@/theme/onyx"
import { useStores } from "@/models"
import { aiurApi } from "@/services/aiur"
import { Button } from "@/components"

export const ShareScreen = observer(() => {
  useHeader({
    title: "Share Conversation",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  const { chatStore, walletStore } = useStores()
  const [isSharing, setIsSharing] = React.useState(false)
  const [shareUrl, setShareUrl] = React.useState("")
  const [error, setError] = React.useState("")

  const handleShare = async () => {
    try {
      setIsSharing(true)
      setError("")

      // Initialize Aiur with user's npub
      aiurApi.setNpub(walletStore.nostrKeys.npub)

      // Get current conversation text and metadata
      const conversationText = chatStore.conversationText
      const metadata = {
        conversationId: chatStore.currentConversationId,
        messageCount: chatStore.currentMessages.length,
        timestamp: Date.now()
      }

      // Share via Aiur API
      const response = await aiurApi.shareConversation({
        content: conversationText,
        metadata
      })

      setShareUrl(response.shareUrl)
    } catch (e) {
      setError(e.message || "Failed to share conversation")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[baseStyles.modalContainer]}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, styles.text]}>Share Conversation</Text>
        <Text style={[styles.subtitle, styles.text]}>
          Share your conversation with others via a secure link.
        </Text>

        <View style={styles.section}>
          <Button
            text={isSharing ? "Generating Share Link..." : "Generate Share Link"}
            onPress={handleShare}
            disabled={isSharing}
            style={styles.button}
          />

          {error ? (
            <Text style={[styles.error, styles.text]}>{error}</Text>
          ) : null}

          {shareUrl ? (
            <View style={styles.urlContainer}>
              <Text style={[styles.label, styles.text]}>Share URL:</Text>
              <Text style={[styles.url, styles.text]} selectable>
                {shareUrl}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={[styles.infoText, styles.text]}>
            • Shared conversations are accessible to anyone with the link{"\n"}
            • Links are valid for 30 days{"\n"}
            • You can revoke access at any time from settings
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const styles = {
  scrollView: {
    flex: 1,
    padding: 16,
  },
  text: {
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
  error: {
    color: colors.error,
    marginBottom: 16,
  },
  urlContainer: {
    backgroundColor: colors.backgroundDark,
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  url: {
    fontSize: 16,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
}
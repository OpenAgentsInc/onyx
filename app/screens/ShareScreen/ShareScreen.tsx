import { observer } from "mobx-react-lite"
import React from "react"
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import { colorsDark as colors } from "@/theme"
import { styles as baseStyles } from "@/theme/onyx"
import { useStores } from "@/models"
import { aiurApi } from "@/services/aiur"
import { Button } from "@/components"
import { typography } from "@/theme/typography"

export const ShareScreen = observer(() => {
  useHeader({
    title: "Share Conversation",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  const { chatStore, walletStore } = useStores()
  const [isSharing, setIsSharing] = React.useState(false)
  const [recipient, setRecipient] = React.useState("")
  const [error, setError] = React.useState("")
  const [shareSuccess, setShareSuccess] = React.useState(false)

  const handleShare = async () => {
    if (!recipient) {
      setError("Please enter a recipient email or npub")
      return
    }

    if (!walletStore.nostrKeys?.npub) {
      setError("Nostr keys not found")
      return
    }

    try {
      setIsSharing(true)
      setError("")
      setShareSuccess(false)

      // Initialize Aiur with user's npub
      aiurApi.setNpub(walletStore.nostrKeys.npub)

      // Share via Aiur API
      const result = await aiurApi.shareChat(chatStore.currentConversationId, {
        recipient,
        messages: chatStore.currentMessages,
        metadata: {
          messageCount: chatStore.currentMessages.length,
          timestamp: Date.now()
        }
      })

      if (result.kind === "ok") {
        setShareSuccess(true)
        setRecipient("")
      } else {
        setError("Failed to share conversation")
      }
    } catch (error: any) {
      setError(error?.message || "Failed to share conversation")
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
        <Text style={[styles.title]}>Share Conversation</Text>
        <Text style={[styles.subtitle]}>
          Share your conversation with another user via their email or npub.
        </Text>

        <View style={styles.section}>
          <Text style={[styles.label]}>Recipient Email or Npub</Text>
          <TextInput
            style={[styles.input]}
            value={recipient}
            onChangeText={setRecipient}
            placeholder="Enter email or npub..."
            placeholderTextColor={colors.textDim}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSharing}
          />

          <Button
            text={isSharing ? "Sharing..." : "Share Conversation"}
            onPress={handleShare}
            disabled={isSharing}
            style={styles.button}
          />

          {error ? (
            <Text style={[styles.error]}>{error}</Text>
          ) : null}

          {shareSuccess ? (
            <Text style={[styles.successText]}>
              Conversation shared successfully!
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={[styles.infoText]}>
            • Recipients will receive a notification{"\n"}
            • They can view the conversation in their Onyx app{"\n"}
            • You can manage shares from settings
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
  title: {
    fontFamily: typography.primary.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.primary.normal,
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontFamily: typography.primary.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    fontFamily: typography.primary.normal,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundDark,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  error: {
    fontFamily: typography.primary.normal,
    fontSize: 14,
    color: colors.error,
    marginBottom: 16,
  },
  successText: {
    fontFamily: typography.primary.normal,
    fontSize: 14,
    color: colors.palette.green500,
    marginBottom: 16,
  },
  infoText: {
    fontFamily: typography.primary.normal,
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
    lineHeight: 20,
  },
}
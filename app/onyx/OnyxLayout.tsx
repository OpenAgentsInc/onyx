import React, { useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { useStores } from "@/models/_helpers/useStores"
import { colors } from "@/theme"
import { BottomButtons } from "./BottomButtons"
import { ChatOverlay } from "./ChatOverlay"
import { ConfigureModal } from "./ConfigureModal"
import { TextInputModal } from "./TextInputModal"
import { ToolTestModal } from "./ToolTestModal"
import { VoiceInputModal } from "./VoiceInputModal"
import { RepoSection } from "./RepoSection"

export const OnyxLayout = observer(() => {
  const { chatStore, coderStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [showConfigureModal, setShowConfigureModal] = useState(false)
  const [showTextInputModal, setShowTextInputModal] = useState(false)
  const [showVoiceInputModal, setShowVoiceInputModal] = useState(false)
  const [showToolTestModal, setShowToolTestModal] = useState(false)

  const handleSendMessage = useCallback(async (message: string) => {
    setError(undefined)
    setIsLoading(true)

    try {
      const options = {
        ...(chatStore.toolsEnabled && coderStore.hasGithubToken && {
          githubToken: coderStore.githubToken,
        }),
      }

      if (chatStore.activeModel === "groq") {
        await chatStore.sendMessageToGroq(message, options)
      } else {
        await chatStore.sendMessageToGemini(message, options)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [chatStore, coderStore])

  useEffect(() => {
    if (chatStore.error) {
      setError(chatStore.error)
      chatStore.setError(null)
    }
  }, [chatStore.error])

  useEffect(() => {
    if (chatStore.toolsEnabled && !coderStore.hasGithubToken) {
      setShowConfigureModal(true)
    }
  }, [chatStore.toolsEnabled, coderStore.hasGithubToken])

  const messages = chatStore.currentMessages

  return (
    <View style={styles.container}>
      <ChatOverlay messages={messages} isLoading={isLoading} error={error?.toString()} />

      <RepoSection />

      <BottomButtons
        onConfigurePress={() => setShowConfigureModal(true)}
        onTextPress={() => setShowTextInputModal(true)}
        onVoicePress={() => setShowVoiceInputModal(true)}
        onToolTestPress={() => setShowToolTestModal(true)}
      />

      <ConfigureModal
        visible={showConfigureModal}
        onClose={() => setShowConfigureModal(false)}
      />

      <TextInputModal
        visible={showTextInputModal}
        onClose={() => setShowTextInputModal(false)}
        onSend={handleSendMessage}
      />

      <VoiceInputModal
        visible={showVoiceInputModal}
        onClose={() => setShowVoiceInputModal(false)}
        onSend={handleSendMessage}
      />

      <ToolTestModal
        visible={showToolTestModal}
        onClose={() => setShowToolTestModal(false)}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
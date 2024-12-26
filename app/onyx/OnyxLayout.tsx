import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { View } from "react-native"
import { useChat } from "@ai-sdk/react"
import Config from "../config"
import { useStores } from "../models/_helpers/useStores"
import { BottomButtons } from "./BottomButtons"
import { ChatOverlay } from "./ChatOverlay"
import { ConfigureModal } from "./ConfigureModal"
import { TextInputModal } from "./TextInputModal"
import { VoiceInputModal } from "./VoiceInputModal"
import { RepoSection } from "./repo/RepoSection"

// Available tools for the AI
const availableTools = ["view_file", "view_folder"]

export const OnyxLayout = observer(() => {
  const { chatStore, coderStore } = useStores()
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [showRepos, setShowRepos] = useState(false)
  const [transcript, setTranscript] = useState("")

  const { isLoading, messages, error, append, setMessages } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: Config.NEXUS_URL,
    body: {
      // Only include GitHub token and tools if both tools are enabled AND we have a token
      ...(chatStore.toolsEnabled && coderStore.githubToken && {
        githubToken: coderStore.githubToken,
        tools: availableTools,
        repos: coderStore.repos.map(repo => ({
          owner: repo.owner,
          name: repo.name,
          branch: repo.branch
        }))
      }),
    },
    onError: (error) => {
      console.error(error, "ERROR")
    },
    onToolCall: async (toolCall) => {
      console.log("TOOL CALL", toolCall)
    },
    onResponse: async (response) => {
      console.log(response, "RESPONSE")
    },
    onFinish: () => console.log("FINISH"),
  })

  const handleStartVoiceInput = () => {
    setTranscript("") // Reset transcript
    setShowVoiceInput(true)
    // TODO: Start voice recording here
  }

  const handleStopVoiceInput = () => {
    // TODO: Stop voice recording here
    setShowVoiceInput(false)
    setTranscript("")
  }

  const handleSendMessage = async (message: string) => {
    append({ content: message, role: "user" })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ChatOverlay messages={messages} isLoading={isLoading} error={error?.toString()} />

      <TextInputModal
        visible={showTextInput}
        onClose={() => setShowTextInput(false)}
        onSendMessage={handleSendMessage}
      />

      <VoiceInputModal
        visible={showVoiceInput}
        onClose={handleStopVoiceInput}
        transcript={transcript}
        onSendMessage={handleSendMessage}
      />

      <ConfigureModal visible={showConfigure} onClose={() => setShowConfigure(false)} />

      <RepoSection visible={showRepos} onClose={() => setShowRepos(false)} />

      <BottomButtons
        onTextPress={() => setShowTextInput(true)}
        onVoicePress={handleStartVoiceInput}
        onConfigurePress={() => setShowConfigure(true)}
        onReposPress={() => setShowRepos(true)}
        setMessages={setMessages}
      />
    </View>
  )
})
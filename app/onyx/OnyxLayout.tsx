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
import { ToolTestModal } from "./ToolTestModal"
import { VoiceInputModal } from "./VoiceInputModal"

// Available tools for the AI
const availableTools = ["view_file", "view_folder"]

export const OnyxLayout = observer(() => {
  const { chatStore } = useStores()
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const [transcript, setTranscript] = useState("")

  const { isLoading, messages, error, append, setMessages } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: Config.NEXUS_URL,
    body: {
      // Include GitHub token and tools in request body when tools are enabled
      ...(chatStore.toolsEnabled &&
        chatStore.hasGithubToken && {
          githubToken: chatStore.githubToken,
          tools: availableTools,
        }),
    },
    onError: (error) => {
      console.error(error, "ERROR")
      // If there's a GitHub token error, show configure modal
      if (error.message?.includes("GitHub token")) {
        setShowConfigure(true)
      }
    },
    onToolCall: async (toolCall) => {
      console.log("TOOL CALL", toolCall)
      // if (toolCall.toolId === "view_file") {
      //   // Show the tool test modal
      //   setShowTools(true)
      //
    },
    onResponse: async (response) => {
      console.log(response, "RESPONSE")

      // const json = await response.json()
      // console.log("JSON", json)

      // // Create a new message from the response
      // const newMessage = {
      //   id: json.result.response.id,
      //   content: json.result.text,
      //   role: "assistant" as const,
      //   createdAt: new Date(json.result.response.timestamp),
      //   toolInvocations: json.result.toolCalls || [],
      // }

      // // Append the new message to existing messages
      // setMessages((prev) => [...prev, newMessage])
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
    // If tools are enabled but no GitHub token, show configure modal
    if (chatStore.toolsEnabled && !chatStore.hasGithubToken) {
      setShowConfigure(true)
      return
    }
    // Create a synthetic event object
    append({ content: message, role: "user" })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ChatOverlay messages={messages} isLoading={isLoading} error={error} />

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

      <ToolTestModal
        visible={showTools}
        onClose={() => setShowTools(false)}
        enabled={chatStore.toolsEnabled}
        onToggle={() => chatStore.setToolsEnabled(!chatStore.toolsEnabled)}
      />

      <ConfigureModal visible={showConfigure} onClose={() => setShowConfigure(false)} />

      <BottomButtons
        onTextPress={() => setShowTextInput(true)}
        onVoicePress={handleStartVoiceInput}
        onConfigurePress={() => setShowConfigure(true)}
        onToolsPress={() => setShowTools(true)}
        setMessages={setMessages}
      />
    </View>
  )
})

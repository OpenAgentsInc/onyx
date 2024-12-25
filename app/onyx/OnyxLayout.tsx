import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { View } from "react-native"
import { useChat } from "@ai-sdk/react"
import { BottomButtons } from "./BottomButtons"
import { ChatOverlay } from "./ChatOverlay"
import { ConfigureModal } from "./ConfigureModal"
import { TextInputModal } from "./TextInputModal"
import { ToolTestModal } from "./ToolTestModal"
import { VoiceInputModal } from "./VoiceInputModal"

export const OnyxLayout = observer(() => {
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const [transcript, setTranscript] = useState("")

  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: "https://nexus.openagents.com/chat",
    onError: (error) => console.error(error, "ERROR"),
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
    // Create a synthetic event object
    const syntheticEvent = {
      target: { value: message },
      preventDefault: () => {},
    } as any

    handleInputChange(syntheticEvent)
    await handleSubmit(syntheticEvent)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ChatOverlay messages={messages} />

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

      <ToolTestModal visible={showTools} onClose={() => setShowTools(false)} />

      <ConfigureModal visible={showConfigure} onClose={() => setShowConfigure(false)} />

      <BottomButtons
        onTextPress={() => setShowTextInput(true)}
        onVoicePress={handleStartVoiceInput}
        onConfigurePress={() => setShowConfigure(true)}
        onToolsPress={() => setShowTools(true)}
      />
    </View>
  )
})

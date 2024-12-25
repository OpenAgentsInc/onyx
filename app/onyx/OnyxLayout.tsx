import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { View } from "react-native"
import { ChatOverlay } from "./ChatOverlay"
import { BottomButtons } from "./BottomButtons"
import { TextInputModal } from "./TextInputModal"
import { VoiceInputModal } from "./VoiceInputModal"
import { ToolTestModal } from "./ToolTestModal"
import { ConfigureModal } from "./ConfigureModal"

export const OnyxLayout = observer(() => {
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const [transcript, setTranscript] = useState("")

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

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ChatOverlay />

      <TextInputModal visible={showTextInput} onClose={() => setShowTextInput(false)} />

      <VoiceInputModal
        visible={showVoiceInput}
        onClose={handleStopVoiceInput}
        transcript={transcript}
      />

      <ToolTestModal
        visible={showTools}
        onClose={() => setShowTools(false)}
      />

      <ConfigureModal
        visible={showConfigure}
        onClose={() => setShowConfigure(false)}
      />

      <BottomButtons
        onTextPress={() => setShowTextInput(true)}
        onVoicePress={handleStartVoiceInput}
        onConfigurePress={() => setShowConfigure(true)}
        onToolsPress={() => setShowTools(true)}
      />
    </View>
  )
})
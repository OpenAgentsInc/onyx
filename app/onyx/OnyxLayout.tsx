import React, { useState, useEffect } from "react"
import { View, ScrollView, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { ConfigureModal } from "./ConfigureModal"
import { TextInputModal } from "./TextInputModal"
import { VoiceInputModal } from "./VoiceInputModal"
import { BottomButtons } from "./BottomButtons"
import { styles } from "./styles"

const ChatOverlay = observer(() => {
  const { chatStore } = useStores()
  
  return (
    <View style={styles.chatOverlay}>
      <ScrollView style={styles.messageList}>
        {chatStore.currentMessages.map((message) => (
          <View key={message.id} style={styles.message}>
            <Text style={styles.messageText}>
              {message.role === "user" ? "> " : ""}{message.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

export const OnyxLayout = observer(() => {
  const { llmStore } = useStores()
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [transcript, setTranscript] = useState("")

  useEffect(() => {
    llmStore.initialize()
  }, [llmStore])

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
      
      <TextInputModal
        visible={showTextInput}
        onClose={() => setShowTextInput(false)}
      />

      <VoiceInputModal
        visible={showVoiceInput}
        onClose={handleStopVoiceInput}
        transcript={transcript}
      />

      <ConfigureModal
        visible={showConfigure}
        onClose={() => setShowConfigure(false)}
      />

      <BottomButtons
        onTextPress={() => setShowTextInput(true)}
        onVoicePress={handleStartVoiceInput}
        onConfigurePress={() => setShowConfigure(true)}
      />
    </View>
  )
})
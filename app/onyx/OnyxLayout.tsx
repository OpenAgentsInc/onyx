import { observer } from "mobx-react-lite"
import React, { useEffect, useRef, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { useStores } from "@/models"
import { BottomButtons } from "./BottomButtons"
import { styles as baseStyles } from "./styles"
import { TextInputModal } from "./TextInputModal"
import { VoiceInputModal } from "./VoiceInputModal"
import { ToolTestModal } from "./ToolTestModal"
import { ConfigureModal } from "./ConfigureModal"
import { IMessage } from "@/models/chat/ChatStore"

const ChatOverlay = observer(() => {
  const { chatStore } = useStores()
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [chatStore.currentMessages])

  return (
    <View style={baseStyles.chatOverlay}>
      <ScrollView
        ref={scrollViewRef}
        style={baseStyles.messageList}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        {chatStore.currentMessages.map((message: IMessage) => (
          <View key={message.id} style={baseStyles.message}>
            <Text style={baseStyles.messageText}>
              {message.role === "user" ? "> " : ""}
              {message.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

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
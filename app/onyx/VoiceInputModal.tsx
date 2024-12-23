import React, { useEffect, useState } from "react"
import { Modal, View, Text, Pressable, ActivityIndicator } from "react-native"
import { styles as baseStyles } from "./styles"
import { styles as voiceStyles } from "./VoiceInputModal.styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { log } from "@/utils/log"
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice"
import { useVoicePermissions } from "@/hooks/useVoicePermissions"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  transcript?: string // Make transcript optional
}

export const VoiceInputModal = observer(({ visible, onClose, transcript }: VoiceInputModalProps) => {
  const { llmStore } = useStores()
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState(transcript || "")
  const [error, setError] = useState("")
  const { hasPermission, isChecking, requestPermissions } = useVoicePermissions()

  useEffect(() => {
    // Initialize voice handlers
    Voice.onSpeechStart = () => setIsRecording(true)
    Voice.onSpeechEnd = () => {
      setIsRecording(false)
      // Automatically restart recording when speech ends
      if (hasPermission && visible) {
        startRecording()
      }
    }
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0]) {
        setTranscribedText(e.value[0])
      }
    }
    Voice.onSpeechError = (e: any) => {
      setError(e.error?.message || "Error occurred")
      setIsRecording(false)
    }

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [hasPermission, visible])

  // Start recording when modal becomes visible and we have permission
  useEffect(() => {
    if (visible) {
      if (hasPermission) {
        startRecording()
      } else if (!isChecking) {
        handleRequestPermission()
      }
    } else {
      cleanup()
    }
  }, [visible, hasPermission, isChecking])

  const handleRequestPermission = async () => {
    const granted = await requestPermissions()
    if (granted) {
      startRecording()
    } else {
      setError("Microphone permission is required for voice input")
    }
  }

  const cleanup = async () => {
    try {
      await Voice.stop()
      await Voice.destroy()
      setTranscribedText("")
      setError("")
      setIsRecording(false)
    } catch (e) {
      console.error("Error cleaning up voice:", e)
    }
  }

  const startRecording = async () => {
    try {
      setError("")
      await Voice.start("en-US")
    } catch (e: any) {
      setError(e.message || "Error starting recording")
    }
  }

  const handleCancel = async () => {
    await cleanup()
    onClose()
  }

  const handleSend = async () => {
    if (!transcribedText.trim()) return

    try {
      // Ensure context is initialized before proceeding
      if (!llmStore.context || !llmStore.isInitialized) {
        await llmStore.initContext()
      }

      const textToSend = transcribedText // Capture current text
      await cleanup() // Clean up voice recording
      onClose() // Close modal immediately

      // Send message after modal is closed
      await llmStore.chatCompletion(textToSend)
    } catch (error) {
      log({
        name: "[VoiceInputModal]",
        preview: "Error sending message",
        value: error instanceof Error ? error.message : "Unknown error",
        important: true
      })
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalHeader}>
          <Pressable onPress={handleCancel}>
            <Text style={[baseStyles.buttonText, baseStyles.cancelText]}>Cancel</Text>
          </Pressable>

          <Pressable onPress={handleSend} disabled={!transcribedText.trim()}>
            <Text style={[
              baseStyles.buttonText,
              !transcribedText.trim() ? baseStyles.disabledText : baseStyles.sendText
            ]}>
              Send
            </Text>
          </Pressable>
        </View>

        <View style={voiceStyles.voiceContainer}>
          {isChecking ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <Text style={voiceStyles.errorText}>{error}</Text>
          ) : (
            <View style={voiceStyles.transcriptionContainer}>
              <Text style={voiceStyles.listeningText}>{isRecording ? "Listening" : "Paused"}</Text>
              {transcribedText ? (
                <Text style={voiceStyles.transcriptionText}>{transcribedText}</Text>
              ) : (
                <Text style={voiceStyles.placeholderText}>Start speaking...</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
})
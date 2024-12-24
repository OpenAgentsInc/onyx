import React, { useEffect, useState, useRef } from "react"
import { Modal, View, Text, Pressable, ActivityIndicator } from "react-native"
import { Audio } from "expo-av"
import { styles as baseStyles } from "./styles"
import { styles as voiceStyles } from "./VoiceInputModal.styles"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"
import { log } from "@/utils/log"
import { groqChatApi } from "@/services/groq/groq-chat"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  transcript?: string
}

export const VoiceInputModal = observer(({ visible, onClose, transcript }: VoiceInputModalProps) => {
  const { chatStore } = useStores()
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState(transcript || "")
  const [error, setError] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const recording = useRef<Audio.Recording | null>(null)
  const shouldTranscribe = useRef(false)

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (visible) {
      setupRecording()
    } else {
      cleanup()
    }
  }, [visible])

  const cleanup = async () => {
    shouldTranscribe.current = false
    if (recording.current) {
      try {
        setIsRecording(false)
        await recording.current.stopAndUnloadAsync()
        recording.current = null
      } catch (err) {
        log.error("[VoiceInputModal] Error cleaning up: " + (err instanceof Error ? err.message : String(err)))
      }
    }
  }

  const setupRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync()
      if (!granted) {
        setError("Microphone permission is required")
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      startRecording()
    } catch (err) {
      setError("Failed to get recording permissions")
      log.error("[VoiceInputModal] Error setting up recording: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const startRecording = async () => {
    try {
      setError("")
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      recording.current = newRecording
      setIsRecording(true)
      shouldTranscribe.current = true
    } catch (err) {
      setError("Failed to start recording")
      log.error("[VoiceInputModal] Error starting recording: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const stopRecording = async () => {
    if (!recording.current) return

    try {
      setIsRecording(false)
      await recording.current.stopAndUnloadAsync()
      const uri = recording.current.getURI()
      recording.current = null

      if (uri && shouldTranscribe.current) {
        await transcribeAudio(uri)
      }
    } catch (err) {
      setError("Failed to stop recording")
      log.error("[VoiceInputModal] Error stopping recording: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const transcribeAudio = async (uri: string) => {
    try {
      setIsTranscribing(true)
      setError("")

      // Send to Groq for transcription
      const result = await groqChatApi.transcribeAudio(uri, {
        model: "whisper-large-v3",
        language: "en",
      })

      if (result.kind === "ok") {
        setTranscribedText(result.response.text)
      } else {
        setError("Failed to transcribe audio")
        log.error("[VoiceInputModal] Transcription error: " + JSON.stringify(result))
      }
    } catch (err) {
      setError("Failed to transcribe audio")
      log.error("[VoiceInputModal] Error transcribing audio: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleCancel = async () => {
    await cleanup()
    setTranscribedText("")
    onClose()
  }

  const handleSend = async () => {
    shouldTranscribe.current = true
    await stopRecording()
  }

  const isDisabled = chatStore.isGenerating || isTranscribing

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

          <Pressable onPress={handleSend} disabled={isDisabled}>
            <Text style={[
              baseStyles.buttonText,
              isDisabled ? baseStyles.disabledText : baseStyles.sendText
            ]}>
              Send
            </Text>
          </Pressable>
        </View>

        <View style={voiceStyles.voiceContainer}>
          {error ? (
            <Text style={voiceStyles.errorText}>{error}</Text>
          ) : (
            <View style={voiceStyles.transcriptionContainer}>
              {isTranscribing ? (
                <View style={voiceStyles.transcribingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={voiceStyles.transcribingText}>Transcribing...</Text>
                </View>
              ) : (
                <>
                  <Text style={voiceStyles.listeningText}>
                    {isRecording ? "Listening..." : "Paused"}
                  </Text>
                  {transcribedText ? (
                    <Text style={voiceStyles.transcriptionText}>{transcribedText}</Text>
                  ) : (
                    <Text style={voiceStyles.placeholderText}>
                      Start speaking...
                    </Text>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
})
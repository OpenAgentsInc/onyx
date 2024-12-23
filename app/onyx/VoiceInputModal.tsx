import { Audio } from "expo-av"
import { observer } from "mobx-react-lite"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native"
import { useStores } from "@/models"
import { groqChatApi } from "@/services/groq/groq-chat"
import { log } from "@/utils/log"
import { styles as baseStyles } from "./styles"
import { styles as voiceStyles } from "./VoiceInputModal.styles"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  transcript?: string
}

export const VoiceInputModal = observer(
  ({ visible, onClose, transcript }: VoiceInputModalProps) => {
    const { chatStore } = useStores()
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState("")
    const recording = useRef<Audio.Recording | null>(null)

    useEffect(() => {
      return () => {
        if (recording.current) {
          recording.current.stopAndUnloadAsync().catch((err) => {
            log.error(
              "[VoiceInputModal] Error cleaning up: " +
                (err instanceof Error ? err.message : String(err)),
            )
          })
        }
      }
    }, [])

    useEffect(() => {
      if (visible) {
        setupRecording()
      } else {
        if (recording.current) {
          recording.current.stopAndUnloadAsync().catch((err) => {
            log.error(
              "[VoiceInputModal] Error cleaning up: " +
                (err instanceof Error ? err.message : String(err)),
            )
          })
          recording.current = null
        }
      }
    }, [visible])

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
        log.error(
          "[VoiceInputModal] Error setting up recording: " +
            (err instanceof Error ? err.message : String(err)),
        )
      }
    }

    const startRecording = async () => {
      try {
        setError("")
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        )
        recording.current = newRecording
        setIsRecording(true)
      } catch (err) {
        setError("Failed to start recording")
        log.error(
          "[VoiceInputModal] Error starting recording: " +
            (err instanceof Error ? err.message : String(err)),
        )
      }
    }

    const handleCancel = () => {
      onClose()
    }

    const handleSend = async () => {
      if (!recording.current) return

      const currentRecording = recording.current
      recording.current = null

      // Close modal first
      onClose()

      try {
        // Then stop recording and process
        await currentRecording.stopAndUnloadAsync()
        const uri = currentRecording.getURI()

        // Start transcription and chat process
        if (uri) {
          chatStore.setIsGenerating(true)
          const result = await groqChatApi.transcribeAudio(uri, {
            model: "whisper-large-v3",
            language: "en",
          })

          if (result.kind === "ok") {
            await chatStore.sendMessage(result.response.text)
          } else {
            log.error("[VoiceInputModal] Transcription error: " + JSON.stringify(result))
          }
        }
      } catch (err) {
        log.error(
          "[VoiceInputModal] Error in send process: " +
            (err instanceof Error ? err.message : String(err)),
        )
      } finally {
        chatStore.setIsGenerating(false)
      }
    }

    const isDisabled = chatStore.isGenerating

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
              <Text
                style={[
                  baseStyles.buttonText,
                  isDisabled ? baseStyles.disabledText : baseStyles.sendText,
                ]}
              >
                Send
              </Text>
            </Pressable>
          </View>

          <View style={voiceStyles.voiceContainer}>
            {error ? (
              <Text style={voiceStyles.errorText}>{error}</Text>
            ) : (
              <View style={voiceStyles.transcriptionContainer}>
                <View style={voiceStyles.listeningContainer}>
                  <Text style={voiceStyles.listeningText}>Listening</Text>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
                <Text style={voiceStyles.placeholderText}>Speak, then press send</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    )
  },
)

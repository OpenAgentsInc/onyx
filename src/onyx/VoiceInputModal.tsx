import { useEffect, useState } from "react"
import { Modal, Pressable, Text, View, ActivityIndicator } from "react-native"
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice"
import { styles } from "./styles"
import { useVoicePermissions } from "../hooks/useVoicePermissions"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  onSend: (text: string) => void
}

export const VoiceInputModal = ({ visible, onClose, onSend }: VoiceInputModalProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
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

  const stopRecording = async () => {
    try {
      await Voice.stop()
    } catch (e: any) {
      setError(e.message || "Error stopping recording")
    }
  }

  const handleCancel = async () => {
    await cleanup()
    onClose()
  }

  const handleSend = async () => {
    const textToSend = transcribedText // Capture current text
    await cleanup()
    if (textToSend) {
      onSend(textToSend)
    }
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={handleCancel}>
            <Text style={[styles.buttonText, styles.cancelText]}>
              Cancel
            </Text>
          </Pressable>
          
          <Pressable onPress={handleSend} disabled={!transcribedText}>
            <Text style={[styles.buttonText, transcribedText ? styles.sendText : styles.disabledText]}>
              Send
            </Text>
          </Pressable>
        </View>

        <View style={styles.voiceContainer}>
          {isChecking ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.transcriptionContainer}>
              <Text style={styles.listeningText}>
                {isRecording ? "Listening..." : "Paused"}
              </Text>
              {transcribedText ? (
                <Text style={styles.transcriptionText}>
                  {transcribedText}
                </Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Start speaking...
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}
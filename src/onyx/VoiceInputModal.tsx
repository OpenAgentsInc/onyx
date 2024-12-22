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
      if (hasPermission) {
        startRecording()
      }
    }
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
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
  }, [hasPermission])

  // Start recording when modal becomes visible and we have permission
  useEffect(() => {
    if (visible) {
      if (hasPermission) {
        startRecording()
      } else if (!isChecking) {
        handleRequestPermission()
      }
    } else {
      stopRecording()
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
    await stopRecording()
    setTranscribedText("")
    setError("")
    onClose()
  }

  const handleSend = async () => {
    await stopRecording()
    if (transcribedText) {
      onSend(transcribedText)
    }
    setTranscribedText("")
    setError("")
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
            <Text style={styles.transcriptionText}>
              {isRecording ? "Listening..." : transcribedText || "Starting..."}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  )
}
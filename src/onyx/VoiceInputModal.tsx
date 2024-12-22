import { useEffect, useState } from "react"
import { Modal, Pressable, Text, View, Platform } from "react-native"
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice"
import { styles } from "./styles"

interface VoiceInputModalProps {
  visible: boolean
  onClose: () => void
  onSend: (text: string) => void
}

export const VoiceInputModal = ({ visible, onClose, onSend }: VoiceInputModalProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Initialize voice
    Voice.onSpeechStart = () => setIsRecording(true)
    Voice.onSpeechEnd = () => setIsRecording(false)
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
  }, [])

  const startRecording = async () => {
    try {
      setError("")
      setTranscribedText("")
      await Voice.start(Platform.OS === "ios" ? "en-US" : "en")
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
    if (isRecording) {
      await stopRecording()
    }
    setTranscribedText("")
    setError("")
    onClose()
  }

  const handleSend = async () => {
    if (isRecording) {
      await stopRecording()
    }
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
          <Pressable 
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.recordButton, isRecording && styles.recordingButton]}
          >
            <Text style={styles.recordButtonText}>
              {isRecording ? "Stop" : "Start Recording"}
            </Text>
          </Pressable>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.transcriptionText}>
              {isRecording ? "Listening..." : transcribedText || "Tap button to start recording"}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  )
}
import { useEffect, useState } from "react"
import { Modal, Pressable, Text, View } from "react-native"
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
    // Initialize voice handlers
    Voice.onSpeechStart = () => setIsRecording(true)
    Voice.onSpeechEnd = () => {
      setIsRecording(false)
      // Automatically restart recording when speech ends
      startRecording()
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
  }, [])

  // Start recording when modal becomes visible
  useEffect(() => {
    if (visible) {
      startRecording()
    } else {
      stopRecording()
    }
  }, [visible])

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
          <Text style={styles.transcriptionText}>
            {error ? error : (isRecording ? "Listening..." : transcribedText || "Starting...")}
          </Text>
        </View>
      </View>
    </Modal>
  )
}
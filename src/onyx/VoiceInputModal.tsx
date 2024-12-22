import { useEffect, useState } from "react"
import { Modal, Pressable, Text, View } from "react-native"
import * as Speech from "expo-speech"
import * as Permissions from "expo-permissions"
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
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (status !== "granted") {
      setError("Microphone permission not granted")
    }
  }

  const startRecording = async () => {
    try {
      setError("")
      setTranscribedText("")
      setIsRecording(true)
      
      const options = {
        language: "en-US",
        onResult: (result: { value: string }) => {
          setTranscribedText(result.value)
        },
        onError: (error: Error) => {
          setError(error.message)
          setIsRecording(false)
        }
      }

      await Speech.startListeningAsync(options)
    } catch (e: any) {
      setError(e.message || "Error starting recording")
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    try {
      await Speech.stopListeningAsync()
      setIsRecording(false)
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
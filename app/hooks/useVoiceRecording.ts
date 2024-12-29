import { Audio } from "expo-av"
import { useEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import { useVoicePermissions } from "./useVoicePermissions"
import { groqChatApi } from "@/services/groq/groq-chat"
import { log } from "@/utils/log"

export const useVoiceRecording = (onTranscription: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const recording = useRef<Audio.Recording | null>(null)
  const { hasPermission, requestPermissions } = useVoicePermissions()

  useEffect(() => {
    return () => {
      stopRecording().catch(err => {
        log.error(
          "[useVoiceRecording] Cleanup error: " +
          (err instanceof Error ? err.message : String(err))
        )
      })
    }
  }, [])

  const setupAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (err) {
      throw new Error("Failed to set audio mode: " + String(err))
    }
  }

  const startRecording = async () => {
    try {
      setError("")
      
      if (!hasPermission) {
        const granted = await requestPermissions()
        if (!granted) {
          setError("Microphone permission is required")
          return false
        }
      }

      await setupAudioMode()

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      recording.current = newRecording
      setIsRecording(true)
      return true
    } catch (err) {
      setError("Failed to start recording")
      log.error(
        "[useVoiceRecording] Start error: " +
        (err instanceof Error ? err.message : String(err))
      )
      return false
    }
  }

  const stopRecording = async () => {
    if (!recording.current) return

    try {
      const currentRecording = recording.current
      recording.current = null
      setIsRecording(false)
      setIsProcessing(true)

      await currentRecording.stopAndUnloadAsync()
      const uri = currentRecording.getURI()

      if (uri) {
        const result = await groqChatApi.transcribeAudio(uri, {
          model: "whisper-large-v3",
          language: "en",
        })

        if (result.kind === "ok") {
          onTranscription(result.response.text)
        } else {
          setError("Transcription failed")
          log.error("[useVoiceRecording] Transcription error: " + JSON.stringify(result))
        }
      }
    } catch (err) {
      setError("Failed to process recording")
      log.error(
        "[useVoiceRecording] Stop error: " +
        (err instanceof Error ? err.message : String(err))
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const cancelRecording = async () => {
    if (!recording.current) return

    try {
      await recording.current.stopAndUnloadAsync()
      recording.current = null
      setIsRecording(false)
    } catch (err) {
      log.error(
        "[useVoiceRecording] Cancel error: " +
        (err instanceof Error ? err.message : String(err))
      )
    }
  }

  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    cancelRecording
  }
}
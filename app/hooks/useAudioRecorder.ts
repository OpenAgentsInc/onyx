import { Audio } from "expo-av"
import { useEffect, useRef } from "react"
import { Alert } from "react-native"
import { useStores } from "../models"
import { useLlamaContext } from "@/services/llama/LlamaContext"
import { LlamaModelManager } from "@/services/llama/LlamaModelManager"

export function useAudioRecorder() {
  const { recordingStore } = useStores()
  const { append } = useLlamaContext()
  const recordingRef = useRef<Audio.Recording | null>(null)
  const modelManager = LlamaModelManager.getInstance()

  useEffect(() => {
    const cleanup = async () => {
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync()
        } catch (err) {
          console.error('Cleanup error:', err)
        }
        recordingRef.current = null
      }
      recordingStore.setIsRecording(false)
      recordingStore.setRecordingUri(null)
    }

    cleanup()

    return () => {
      cleanup()
    }
  }, [])

  const startRecording = async () => {
    try {
      if (recordingRef.current) {
        console.log('Existing recording found, stopping first...')
        await stopRecording()
      }

      const permission = await Audio.requestPermissionsAsync()
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone access to record audio.')
        recordingStore.setIsRecording(false)
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      recordingRef.current = newRecording
      await newRecording.startAsync()

      recordingStore.setIsRecording(true)
      console.log('Started recording')
    } catch (err) {
      console.error('Failed to start recording:', err)
      Alert.alert('Error', 'Failed to start recording')
      recordingStore.setIsRecording(false)
      recordingRef.current = null
    }
  }

  const stopRecording = async (): Promise<string | undefined> => {
    try {
      if (!recordingRef.current) {
        console.log('No recording to stop')
        recordingStore.setIsRecording(false)
        return undefined
      }

      console.log('Stopping recording...')
      await recordingRef.current.stopAndUnloadAsync()
      const uri = recordingRef.current.getURI()
      console.log('Recording stopped, uri:', uri)

      recordingStore.setRecordingUri(uri)
      recordingRef.current = null
      recordingStore.setIsRecording(false)

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      })

      try {
        recordingStore.setProp("isTranscribing", true)
        console.log("Starting transcription...")
        const transcription = await recordingStore.transcribeRecording()
        console.log("Transcription result:", transcription)

        if (transcription) {
          // Touch the context before using it
          modelManager.touchContext()
          // Send directly to Llama chat
          await append({ role: "user", content: transcription })
        }
      } catch (err) {
        console.error('Failed to process recording:', err)
        Alert.alert('Error', 'Failed to process recording')
      } finally {
        recordingStore.setProp("isTranscribing", false)
      }

      return uri || undefined
    } catch (err) {
      console.error('Failed to stop recording:', err)
      Alert.alert('Error', 'Failed to stop recording')
      recordingStore.setIsRecording(false)
      recordingRef.current = null
      return undefined
    }
  }

  const toggleRecording = async () => {
    console.log('Toggle recording, current state:', recordingStore.isRecording)
    if (recordingStore.isRecording) {
      return await stopRecording()
    } else {
      return await startRecording()
    }
  }

  return {
    isRecording: recordingStore.isRecording,
    recordingUri: recordingStore.recordingUri,
    toggleRecording,
  }
}
import { Audio } from 'expo-av'
import { useEffect, useRef } from 'react'
import { Alert } from 'react-native'
import { useStores } from '../models'

export function useAudioRecorder() {
  const { recordingStore } = useStores()
  // Use ref to persist recording instance between renders
  const recordingRef = useRef<Audio.Recording | null>(null)

  // Reset recording state on mount and cleanup
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

    // Reset state when component mounts
    cleanup()

    // Cleanup function for unmount
    return () => {
      cleanup()
    }
  }, [])

  const startRecording = async () => {
    try {
      // Safety check - ensure no existing recording
      if (recordingRef.current) {
        console.log('Existing recording found, stopping first...')
        await stopRecording()
      }

      // Request permissions
      const permission = await Audio.requestPermissionsAsync()
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone access to record audio.')
        recordingStore.setIsRecording(false)
        return
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      // Start recording
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

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) {
        console.log('No recording to stop')
        recordingStore.setIsRecording(false)
        return
      }

      console.log('Stopping recording...')
      await recordingRef.current.stopAndUnloadAsync()
      const uri = recordingRef.current.getURI()
      console.log('Recording stopped, uri:', uri)
      
      recordingStore.setRecordingUri(uri)
      recordingRef.current = null
      recordingStore.setIsRecording(false)

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      })

      // TODO: Send recording to server
      console.log('Would send recording to server here')

      return uri
    } catch (err) {
      console.error('Failed to stop recording:', err)
      Alert.alert('Error', 'Failed to stop recording')
      recordingStore.setIsRecording(false)
      recordingRef.current = null
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
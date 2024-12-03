import { Audio } from 'expo-av'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useStores } from '../models'

export function useAudioRecorder() {
  const { recordingStore } = useStores()
  let recording: Audio.Recording | null = null

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync()
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone access to record audio.')
        return
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      // Start recording
      recording = new Audio.Recording()
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await recording.startAsync()
      
      recordingStore.setIsRecording(true)
      console.log('Started recording')
    } catch (err) {
      console.error('Failed to start recording', err)
      Alert.alert('Error', 'Failed to start recording')
    }
  }

  const stopRecording = async () => {
    try {
      if (!recording) return

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      recordingStore.setRecordingUri(uri)
      recording = null
      recordingStore.setIsRecording(false)

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      })

      console.log('Stopped recording, uri:', uri)
      // TODO: Send recording to server
      console.log('Would send recording to server here')

      return uri
    } catch (err) {
      console.error('Failed to stop recording', err)
      Alert.alert('Error', 'Failed to stop recording')
    }
  }

  const toggleRecording = async () => {
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
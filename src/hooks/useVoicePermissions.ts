import { useEffect, useState } from 'react'
import Voice from '@react-native-voice/voice'
import * as ExpoPermissions from 'expo-permissions'
import { Platform } from 'react-native'

export const useVoicePermissions = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      setIsChecking(true)
      
      // Check microphone permission
      const { status: micStatus } = await ExpoPermissions.getAsync(ExpoPermissions.AUDIO_RECORDING)
      
      // On iOS, we also need to check speech recognition permission
      let speechStatus = 'granted'
      if (Platform.OS === 'ios') {
        const { status } = await ExpoPermissions.getAsync(ExpoPermissions.SPEECH_RECOGNITION)
        speechStatus = status
      }

      if (micStatus !== 'granted' || speechStatus !== 'granted') {
        const results = await Promise.all([
          ExpoPermissions.askAsync(ExpoPermissions.AUDIO_RECORDING),
          Platform.OS === 'ios' ? ExpoPermissions.askAsync(ExpoPermissions.SPEECH_RECOGNITION) : Promise.resolve({ status: 'granted' })
        ])

        const allGranted = results.every(result => result.status === 'granted')
        setHasPermission(allGranted)
      } else {
        setHasPermission(true)
      }
    } catch (error) {
      console.error('Error checking voice permissions:', error)
      setHasPermission(false)
    } finally {
      setIsChecking(false)
    }
  }

  const requestPermissions = async () => {
    try {
      setIsChecking(true)
      
      const results = await Promise.all([
        ExpoPermissions.askAsync(ExpoPermissions.AUDIO_RECORDING),
        Platform.OS === 'ios' ? ExpoPermissions.askAsync(ExpoPermissions.SPEECH_RECOGNITION) : Promise.resolve({ status: 'granted' })
      ])

      const allGranted = results.every(result => result.status === 'granted')
      setHasPermission(allGranted)
      return allGranted
    } catch (error) {
      console.error('Error requesting voice permissions:', error)
      setHasPermission(false)
      return false
    } finally {
      setIsChecking(false)
    }
  }

  return {
    hasPermission,
    isChecking,
    checkPermissions,
    requestPermissions
  }
}
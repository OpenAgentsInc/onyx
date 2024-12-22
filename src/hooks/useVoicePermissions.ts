import { useEffect, useState } from 'react'
import Voice from '@react-native-voice/voice'
import * as ExpoPermissions from 'expo-permissions'

export const useVoicePermissions = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      setIsChecking(true)
      const { status: micStatus } = await ExpoPermissions.getAsync(ExpoPermissions.AUDIO_RECORDING)
      
      if (micStatus !== 'granted') {
        const { status } = await ExpoPermissions.askAsync(ExpoPermissions.AUDIO_RECORDING)
        setHasPermission(status === 'granted')
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
      const { status } = await ExpoPermissions.askAsync(ExpoPermissions.AUDIO_RECORDING)
      setHasPermission(status === 'granted')
      return status === 'granted'
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
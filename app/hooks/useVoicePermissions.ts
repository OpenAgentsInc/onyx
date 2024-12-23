import { useEffect, useState } from "react"
import { PermissionsAndroid, Platform } from "react-native"

export const useVoicePermissions = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      setIsChecking(true)

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        )

        if (!granted) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: "Microphone Permission",
              message: "Onyx needs access to your microphone for voice input",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          )
          setHasPermission(result === PermissionsAndroid.RESULTS.GRANTED)
        } else {
          setHasPermission(true)
        }
      } else {
        // iOS automatically handles permissions through Voice API
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

      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "Onyx needs access to your microphone for voice input",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        )

        const granted = result === PermissionsAndroid.RESULTS.GRANTED
        setHasPermission(granted)
        return granted
      }

      // iOS will handle permissions through the Voice API
      setHasPermission(true)
      return true
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

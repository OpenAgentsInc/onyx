import { useEffect, useState } from "react"
import { Keyboard, Platform } from "react-native"

// Module-level singleton state
let isKeyboardOpening = false
let isKeyboardOpened = false
let listeners: Set<(isOpened: boolean) => void> = new Set()
let isInitialized = false

export function useKeyboard() {
  const [isOpened, setIsOpened] = useState(isKeyboardOpened)

  useEffect(() => {
    // Add component's state setter to listeners
    listeners.add(setIsOpened)

    if (!isInitialized) {
      // Set up listeners only once
      const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"
      const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"

      const showListener = Keyboard.addListener(showEvent, () => {
        isKeyboardOpening = true
        isKeyboardOpened = true
        listeners.forEach(listener => listener(true))
      })

      const hideListener = Keyboard.addListener(hideEvent, () => {
        isKeyboardOpening = false
        isKeyboardOpened = false
        listeners.forEach(listener => listener(false))
      })

      isInitialized = true

      // Cleanup on app unmount
      return () => {
        showListener.remove()
        hideListener.remove()
        isInitialized = false
        listeners.clear()
      }
    }

    // Cleanup component's listener
    return () => {
      listeners.delete(setIsOpened)
    }
  }, [])

  return {
    isOpening: isKeyboardOpening,
    isOpened,
    dismiss: Keyboard.dismiss,
  }
}
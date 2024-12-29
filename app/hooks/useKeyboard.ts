import { useEffect, useState, useRef } from "react"
import { Keyboard, Platform, TextInput } from "react-native"

// Module-level singleton state
let isKeyboardOpening = false
let isKeyboardOpened = false
let listeners: Set<(isOpened: boolean) => void> = new Set()
let isInitialized = false
let inputRef = null

export function useKeyboard() {
  const [isOpened, setIsOpened] = useState(isKeyboardOpened)
  const ref = useRef<TextInput>(null)

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
        inputRef = null
      }
    }

    // Cleanup component's listener
    return () => {
      listeners.delete(setIsOpened)
    }
  }, [])

  // Store ref if this instance provides one
  if (ref.current && !inputRef) {
    inputRef = ref.current
  }

  return {
    isOpening: isKeyboardOpening,
    isOpened,
    dismiss: Keyboard.dismiss,
    show: () => {
      if (inputRef) {
        inputRef.focus()
      }
    },
    ref,
  }
}
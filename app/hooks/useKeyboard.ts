import { useEffect, useState, useRef } from "react"
import { Keyboard, Platform, TextInput } from "react-native"

// Module-level singleton state
let isKeyboardOpening = false
let isKeyboardOpened = false
let listeners: Set<(isOpened: boolean) => void> = new Set()
let isInitialized = false
let globalInputRef: TextInput | null = null

export function useKeyboard() {
  const [isOpened, setIsOpened] = useState(isKeyboardOpened)
  const localRef = useRef<TextInput>(null)

  useEffect(() => {
    // Add component's state setter to listeners
    listeners.add(setIsOpened)

    // Update global ref when local ref is available
    if (localRef.current) {
      globalInputRef = localRef.current
    }

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
        globalInputRef = null
      }
    }

    // Cleanup component's listener and ref
    return () => {
      listeners.delete(setIsOpened)
      if (globalInputRef === localRef.current) {
        globalInputRef = null
      }
    }
  }, [])

  // Update global ref whenever local ref changes
  useEffect(() => {
    if (localRef.current) {
      globalInputRef = localRef.current
    }
  }, [localRef.current])

  return {
    isOpening: isKeyboardOpening,
    isOpened,
    dismiss: Keyboard.dismiss,
    show: () => {
      console.log('show called', !!globalInputRef)
      if (globalInputRef) {
        console.log('focusing')
        globalInputRef.focus()
      }
    },
    ref: localRef,
  }
}
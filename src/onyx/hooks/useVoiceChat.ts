import { useState, useCallback } from "react"
import { useChatStore } from "./useChatStore"

export const useVoiceChat = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { sendMessage, isInferencing } = useChatStore()

  const showVoiceModal = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  const hideVoiceModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const handleVoiceInput = useCallback(async (text: string) => {
    await sendMessage(text)
  }, [sendMessage])

  return {
    isModalVisible,
    showVoiceModal,
    hideVoiceModal,
    handleVoiceInput,
    isInferencing,
  }
}
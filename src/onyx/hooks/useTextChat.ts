import { useState, useCallback } from "react"
import { useChatStore } from "./useChatStore"

export const useTextChat = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { sendMessage, isInferencing } = useChatStore()

  const showTextModal = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  const hideTextModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const handleTextInput = useCallback(async (text: string) => {
    await sendMessage(text)
  }, [sendMessage])

  return {
    isModalVisible,
    showTextModal,
    hideTextModal,
    handleTextInput,
    isInferencing,
  }
}
import React from "react"
import { useTextChat } from "./hooks/useTextChat"
import { TextInputModal } from "./TextInputModal"

interface TextChatProps {
  children: (props: {
    showTextModal: () => void
    isInferencing: boolean
  }) => React.ReactNode
}

export const TextChat: React.FC<TextChatProps> = ({ children }) => {
  const {
    isModalVisible,
    showTextModal,
    hideTextModal,
    handleTextInput,
    isInferencing,
  } = useTextChat()

  return (
    <>
      {children({
        showTextModal,
        isInferencing,
      })}
      <TextInputModal
        visible={isModalVisible}
        onClose={hideTextModal}
        onSend={handleTextInput}
      />
    </>
  )
}
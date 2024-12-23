import React from "react"
import { useVoiceChat } from "./hooks/useVoiceChat"
import { VoiceInputModal } from "./VoiceInputModal"

interface VoiceChatProps {
  children: (props: {
    showVoiceModal: () => void
    isInferencing: boolean
  }) => React.ReactNode
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ children }) => {
  const {
    isModalVisible,
    showVoiceModal,
    hideVoiceModal,
    handleVoiceInput,
    isInferencing,
  } = useVoiceChat()

  return (
    <>
      {children({
        showVoiceModal,
        isInferencing,
      })}
      <VoiceInputModal
        visible={isModalVisible}
        onClose={hideVoiceModal}
        onSend={handleVoiceInput}
      />
    </>
  )
}
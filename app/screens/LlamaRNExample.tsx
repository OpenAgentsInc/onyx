import { observer } from "mobx-react-lite"
import React from "react"
import { ChatContainer } from "@/components/chat/ChatContainer"

export const LlamaRNExample = observer(function LlamaRNExample() {
  return <ChatContainer />
})

export default LlamaRNExample
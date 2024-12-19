import React from "react"
import { Bubble } from "./Bubble"

import type { ReactNode } from 'react'
import type { MessageType } from '@flyerhq/react-native-chat-ui'

interface ChatBubbleProps {
  child: ReactNode
  message: MessageType.Any
}

export const ChatBubble = ({ child, message }: ChatBubbleProps) => (
  <Bubble child={child} message={message} />
)

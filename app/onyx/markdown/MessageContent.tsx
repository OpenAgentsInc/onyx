import React from "react"
import { Linking } from "react-native"
import Markdown from "react-native-markdown-display"
import { markdownStyles } from "./styles"
import { IMessage } from "@/models/chat/ChatStore"

interface MessageContentProps {
  message: IMessage
}

export function MessageContent({ message }: MessageContentProps) {
  const handleLinkPress = (url: string) => {
    // Handle link clicks - return true to use default behavior (open in browser)
    // You could add custom handling here for specific link types
    return Linking.openURL(url)
  }

  const content = message.role === "user" ? `> ${message.content}` : message.content

  return (
    <Markdown
      style={markdownStyles}
      onLinkPress={handleLinkPress}
    >
      {content}
    </Markdown>
  )
}
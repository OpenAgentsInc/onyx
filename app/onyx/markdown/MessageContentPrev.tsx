import React from "react"
import { Linking, StyleSheet, View } from "react-native"
import Markdown from "react-native-markdown-display"
import { IMessage } from "@/models/chat/ChatStore"
import { colors } from "@/theme"
import { markdownStyles } from "./styles"

interface MessageContentProps {
  message: IMessage
}

export function MessageContent({ message }: MessageContentProps) {
  const handleLinkPress = (url: string) => {
    // Handle link clicks
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err))
    // Return true to indicate we've handled the link
    return true
  }

  const isUserMessage = message.role === "user"

  return (
    <View style={[styles.container, isUserMessage && styles.userMessage]}>
      <Markdown style={markdownStyles} onLinkPress={handleLinkPress}>
        {message.content}
      </Markdown>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  userMessage: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.text,
    opacity: 0.8,
  },
})

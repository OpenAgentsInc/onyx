import React from "react"
import { Linking, View, StyleSheet } from "react-native"
import Markdown from "react-native-markdown-display"
import { markdownStyles } from "./styles"
import { IMessage } from "@/models/chat/ChatStore"
import { colors } from "@/theme"

interface MessageContentProps {
  message: IMessage
}

export function MessageContent({ message }: MessageContentProps) {
  const handleLinkPress = (url: string) => {
    // Handle link clicks - return true to use default behavior (open in browser)
    // You could add custom handling here for specific link types
    return Linking.openURL(url)
  }

  const isUserMessage = message.role === "user"

  return (
    <View style={[styles.container, isUserMessage && styles.userMessage]}>
      <Markdown
        style={markdownStyles}
        onLinkPress={handleLinkPress}
      >
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
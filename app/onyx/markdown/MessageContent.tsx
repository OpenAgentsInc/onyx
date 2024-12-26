import React from "react"
import { Linking, StyleSheet, View } from "react-native"
import Markdown from "react-native-markdown-display"
import { colors } from "@/theme"
import { Message } from "@ai-sdk/react"
import { markdownStyles } from "./styles"
import { ToolInvocation } from "./ToolInvocation"

interface ToolInvocationType {
  toolCallId: string
  toolName?: string
  state?: string
  [key: string]: any
}

interface MessageContentProps {
  message: Message & {
    toolInvocations?: ToolInvocationType[]
  }
}

export function MessageContent({ message }: MessageContentProps) {
  const handleLinkPress = (url: string) => {
    // Handle link clicks
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err))
    // Return true to indicate we've handled the link
    return true
  }

  const isUserMessage = message.role === "user"
  const hasToolInvocations = !isUserMessage && Array.isArray(message.toolInvocations) && message.toolInvocations.length > 0
  const hasContent = message.content && message.content.trim() !== ""

  return (
    <View style={[styles.container, isUserMessage && styles.userMessage]}>
      {hasContent && (
        <Markdown style={markdownStyles} onLinkPress={handleLinkPress}>
          {message.content}
        </Markdown>
      )}

      {hasToolInvocations && message.toolInvocations && (
        <View style={[styles.toolInvocations, hasContent && styles.toolInvocationsWithContent]}>
          {message.toolInvocations.map((invocation, index) => (
            <ToolInvocation
              key={`${invocation.toolCallId || invocation.toolName || index}`}
              toolInvocation={invocation}
            />
          ))}
        </View>
      )}
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
  toolInvocations: {
    marginTop: 0,
  },
  toolInvocationsWithContent: {
    marginTop: 8,
  },
})
import React, { useContext } from "react"
import { Text, TouchableOpacity } from "react-native"
import { typography } from "@/theme"
import { ThemeContext, UserContext } from "@flyerhq/react-native-chat-ui"
import Clipboard from "@react-native-clipboard/clipboard"

import type { ReactNode } from 'react'
import type { MessageType } from '@flyerhq/react-native-chat-ui'
export const Bubble = ({
  child,
  message,
}: {
  child: ReactNode
  message: MessageType.Any
}) => {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const currentUserIsAuthor = user?.id === message.author.id
  const { copyable, timings } = message.metadata || {}

  const Container: React.ComponentClass<any> = TouchableOpacity

  const handleLongPress = () => {
    if (message.type === 'text') {
      Clipboard.setString(message.text)
    }
  }

  return (
    <Container
      style={{
        backgroundColor:
          !currentUserIsAuthor || message.type === 'image'
            ? theme.colors.secondary
            : theme.colors.primary,
        borderBottomLeftRadius: currentUserIsAuthor
          ? theme.borders.messageBorderRadius
          : 0,
        borderBottomRightRadius: currentUserIsAuthor
          ? 0
          : theme.borders.messageBorderRadius,
        borderColor: 'transparent',
        borderRadius: theme.borders.messageBorderRadius,
        overflow: 'hidden',
      }}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      {child}
      {timings && (
        <Text
          style={{
            textAlign: 'right',
            color: '#ccc',
            paddingRight: 12,
            paddingBottom: 12,
            marginTop: -8,
            fontSize: 10,
            fontFamily: typography.primary.normal
          }}
        >
          {timings}
        </Text>
      )}
    </Container>
  )
}

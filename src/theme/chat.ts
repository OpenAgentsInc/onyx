// theme.ts
import { darkTheme } from "@flyerhq/react-native-chat-ui"
import { colors, typography } from "./"

import type { Theme } from '@flyerhq/react-native-chat-ui'

export const monoTheme: Theme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    primary: colors.palette.neutral200,
    secondary: 'transparent', // colors.palette.neutral200,
    background: 'transparent',
    inputBackground: colors.palette.neutral100,
    inputText: colors.palette.neutral800,
    error: colors.palette.neutral600,
    receivedMessageDocumentIcon: colors.palette.neutral600,
    sentMessageDocumentIcon: colors.palette.neutral300,
  },
  borders: {
    ...darkTheme.borders,
    inputBorderRadius: 20,
    messageBorderRadius: 20,
  },
  fonts: {
    ...darkTheme.fonts,
    dateDividerTextStyle: { fontFamily: typography.primary.normal },
    emptyChatPlaceholderTextStyle: { fontFamily: typography.primary.normal },
    inputTextStyle: { fontFamily: typography.primary.normal },
    receivedMessageBodyTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    receivedMessageCaptionTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    receivedMessageLinkDescriptionTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    receivedMessageLinkTitleTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    sentMessageBodyTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    sentMessageCaptionTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    sentMessageLinkDescriptionTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    sentMessageLinkTitleTextStyle: { fontFamily: typography.primary.normal, color: 'white' },
    userAvatarTextStyle: { fontFamily: typography.primary.normal },
    userNameTextStyle: { fontFamily: typography.primary.normal },
  },
  insets: {
    ...darkTheme.insets,
    messageInsetsHorizontal: 12,
    messageInsetsVertical: 12,
  }
}

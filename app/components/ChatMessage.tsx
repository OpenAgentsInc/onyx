import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types/ollama';
import { typography } from '@/theme';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#0084ff',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    fontFamily: typography.primary.normal,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#fff',
  },
});
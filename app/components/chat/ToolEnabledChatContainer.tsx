import { observer } from 'mobx-react-lite';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat } from '@flyerhq/react-native-chat-ui';
import { colors } from '@/theme/colorsDark';
import { useStores } from '@/models';
import { ChatBubble } from './ChatBubble';
import { monoTheme } from './ChatTheme';
import { useLlamaVercelChat } from '@/hooks/useLlamaVercelChat';
import type { MessageType } from '@flyerhq/react-native-chat-ui';
import type { ChatMessage } from '@/services/llama/LlamaTypes';

const randId = () => Math.random().toString(36).substr(2, 9);
const user = { id: 'y9d7f8pgn' };
const systemId = 'h3o3lc5xj';
const system = { id: systemId };
const defaultConversationId = 'default';

export const ToolEnabledChatContainer = observer(function ToolEnabledChatContainer() {
  const { modelStore } = useStores();
  const context = modelStore.context;
  const { append, isLoading, handleModelInit } = useLlamaVercelChat();
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const conversationIdRef = useRef<string>(defaultConversationId);

  const addMessage = React.useCallback((message: MessageType.Any, batching = false) => {
    if (batching) {
      setMessages([message, ...messages]);
    } else {
      setMessages((msgs) => [message, ...msgs]);
    }
  }, [messages]);

  const addSystemMessage = React.useCallback((text: string, metadata = {}) => {
    const textMessage: ChatMessage = {
      author: system,
      createdAt: Date.now(),
      id: randId(),
      text,
      type: 'text',
      metadata: { system: true, ...metadata },
    };
    addMessage(textMessage);
    return textMessage.id;
  }, [addMessage]);

  const handleSendPress = React.useCallback(async (message: MessageType.PartialText) => {
    if (!context) {
      addSystemMessage('Please load a model first');
      return;
    }

    // Handle regular messages
    const textMessage: ChatMessage = {
      author: user,
      createdAt: Date.now(),
      id: randId(),
      text: message.text,
      type: 'text',
      metadata: {
        contextId: context?.id,
        conversationId: conversationIdRef.current,
      },
    };

    addMessage(textMessage);

    const response = await append({ role: 'user', content: message.text });
    if (response) {
      const assistantMessage: ChatMessage = {
        author: system,
        createdAt: Date.now(),
        id: response.id,
        text: response.content,
        type: 'text',
        metadata: {
          contextId: context?.id,
          conversationId: conversationIdRef.current,
        },
      };
      addMessage(assistantMessage);
    }
  }, [context, append, addMessage, addSystemMessage]);

  return (
    <SafeAreaProvider>
      <Chat
        renderBubble={({ child, message }) => (
          <ChatBubble child={child} message={message} />
        )}
        theme={monoTheme}
        messages={messages}
        onSendPress={handleSendPress}
        user={{ id: 'user' }}
        onAttachmentPress={!context ? handleModelInit : undefined}
        flatListProps={{
          marginBottom: 60
        }}
        textInputProps={{
          editable: true,
          placeholder: !context
            ? 'Load model to start chatting'
            : 'Type your message here',
          style: {
            color: colors.palette.neutral800,
            backgroundColor: colors.palette.neutral200,
          }
        }}
      />
    </SafeAreaProvider>
  );
});
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { websocketConfig } from '@/config/websocket';
import { useWebSocket } from '@/services/websocket/useWebSocket';
import { ResponseMessage } from '@/types/websocket';

const ChatScreen = observer(() => {
  const { state, messages, sendMessage } = useWebSocket(websocketConfig);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      try {
        await sendMessage(input);
        setInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const renderMessage = ({ item: message, index }: { item: ResponseMessage; index: number }) => (
    <View key={index} style={styles.messageContainer}>
      <Text style={styles.messageText}>{message.payload.content}</Text>
      {message.payload.error && (
        <Text style={styles.errorText}>{message.payload.error}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          editable={state.connected}
        />
        <Button
          title="Send"
          onPress={handleSend}
          disabled={!state.connected || !input.trim()}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default ChatScreen;
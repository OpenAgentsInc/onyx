import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import MessageItem from "./MessageItem"

interface MessageListProps {
  messages: string[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ScrollView
      style={styles.messageContainer}
      contentContainerStyle={styles.messageContent}
    >
      {messages.map((msg, index) => (
        <MessageItem key={index} message={msg} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  messageContent: {
    paddingVertical: 10,
  },
});

export default MessageList;

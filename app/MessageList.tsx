// MessageList.tsx
import React from "react"
import { ScrollView, StyleSheet } from "react-native"
import Markdown from "react-native-markdown-display"

export interface MessageListProps {
  messages: string[];
}

const MessageList = React.forwardRef<ScrollView, MessageListProps>(
  ({ messages }, ref) => {
    return (
      <ScrollView ref={ref} style={styles.container} contentContainerStyle={styles.content}>
        {messages.map((msg, index) => (
          <Markdown key={index} style={markdownStyles}>
            {msg}
          </Markdown>
        ))}
      </ScrollView>
    );
  }
);

MessageList.displayName = "MessageList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 10,
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    color: "white",
    backgroundColor: "black",
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  code_inline: {
    backgroundColor: "#333",
    color: "white",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fence: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 4,
  },
};

export default MessageList;

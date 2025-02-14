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
    fontSize: 12,
    color: "white",
    backgroundColor: "black",
    marginVertical: 0,
    padding: 4,
  },
  code_inline: {
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fence: {
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 4,
  },
};

export default MessageList;

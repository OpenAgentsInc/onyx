// MessageList.tsx
import React from "react"
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View
} from "react-native"
import Markdown from "react-native-markdown-display"
import { MaterialIcons } from "@expo/vector-icons"

export interface MessageListProps {
  messages: string[];
  onCopyAll: () => void;
  isProcessing: boolean;
  processingDetails: string;
}

const MessageList = React.forwardRef<ScrollView, MessageListProps>(
  ({ messages, onCopyAll, isProcessing, processingDetails }, ref) => {
    return (
      <View style={styles.wrapper}>
        <ScrollView ref={ref} style={styles.container} contentContainerStyle={styles.content}>
          {messages.map((msg, index) => (
            <Markdown key={index} style={markdownStyles}>
              {msg}
            </Markdown>
          ))}
          {messages.length > 0 && (
            <Pressable style={styles.copyButton} onPress={onCopyAll}>
              <MaterialIcons name="content-copy" size={16} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.copyButtonText}>Copy All</Text>
            </Pressable>
          )}
          {isProcessing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.loadingText}>{processingDetails}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
);

MessageList.displayName = "MessageList";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  copyButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginLeft: 12,
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

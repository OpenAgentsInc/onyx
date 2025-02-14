import * as Clipboard from "expo-clipboard"
import React from "react"
import { Alert, Pressable, StyleSheet, Text } from "react-native"

interface MessageItemProps {
  message: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const handleLongPress = () => {
    Clipboard.setString(message);
    Alert.alert("Copied", "Message copied to clipboard.");
  };

  return (
    <Pressable onLongPress={handleLongPress}>
      <Text style={styles.message}>{message}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    color: "white",
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 8,
  },
});

export default MessageItem;

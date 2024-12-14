import { observer } from "mobx-react-lite"
import { FC, useCallback, useRef, useState } from "react"
import {
    ScrollView, StyleSheet, TextInput, TouchableOpacity, View
} from "react-native"
import { Screen, Text } from "@/components"
import { ChatMessage } from "@/components/ChatMessage"
import { AppStackScreenProps } from "@/navigators"
import { useOllamaChat } from "@/services/ollama/useOllamaChat"
import { typography } from "@/theme"
import { colors } from "@/theme/colorsDark"

interface InboxScreenProps extends AppStackScreenProps<"Inbox"> { }

export const InboxScreen: FC<InboxScreenProps> = observer(function InboxScreen() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    connected,
  } = useOllamaChat()

  const inputRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [inputText, setInputText] = useState("")

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return

    const text = inputText.trim()
    setInputText("")

    try {
      await sendMessage(text)
      // Scroll to bottom after message is sent
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }, [inputText, isLoading, sendMessage])

  if (!connected) {
    return (
      <Screen style={styles.root} preset="fixed">
        <View style={styles.disconnectedContainer}>
          <Text style={styles.disconnectedText}>
            Connecting to Pylon...
          </Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen
      style={styles.root}
      preset="scroll"
      keyboardOffset={100}
      ScrollViewProps={{
        ref: scrollViewRef,
        keyboardShouldPersistTaps: "handled",
        contentContainerStyle: styles.scrollContent,
      }}
    >
      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={[
            styles.sendButtonText,
            (!inputText.trim() || isLoading) && styles.sendButtonTextDisabled
          ]}>
            {isLoading ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: 8,
    color: '#fff',
    fontFamily: typography.primary.normal,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 45,
  },
  sendButton: {
    backgroundColor: colors.palette.accent200,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
  sendButtonText: {
    color: '#fff',
    fontFamily: typography.primary.medium,
    fontSize: 16,
  },
  sendButtonTextDisabled: {
    color: '#666',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontFamily: typography.primary.normal,
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#ff000033',
    borderRadius: 8,
  },
  errorText: {
    color: '#ff4444',
    fontFamily: typography.primary.normal,
  },
  disconnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectedText: {
    color: '#666',
    fontFamily: typography.primary.normal,
    fontSize: 16,
  },
});

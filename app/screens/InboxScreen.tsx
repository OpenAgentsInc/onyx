import { observer } from "mobx-react-lite"
import { FC, useCallback, useRef, useState } from "react"
import {
    ScrollView, StyleSheet, TextInput, TouchableOpacity, View
} from "react-native"
import { Screen, Text } from "@/components"
import { ChatMessage } from "@/components/ChatMessage"
import { AppStackScreenProps } from "@/navigators"
import { useOllamaChat } from "@/services/ollama/useOllamaChat"
import { usePrompts } from "@/services/prompts/usePrompts"
import { typography } from "@/theme"
import { colors } from "@/theme/colorsDark"

interface InboxScreenProps extends AppStackScreenProps<"Inbox"> { }

export const InboxScreen: FC<InboxScreenProps> = observer(function InboxScreen() {
  const {
    messages,
    isLoading: chatLoading,
    error: chatError,
    sendMessage,
    clearMessages,
    connected: chatConnected,
  } = useOllamaChat()

  const {
    getPrompt,
    isLoading: promptLoading,
    error: promptError,
    connected: promptConnected,
  } = usePrompts()

  const inputRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [inputText, setInputText] = useState("")

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || chatLoading) return

    const text = inputText.trim()
    setInputText("")

    try {
      await sendMessage(text)
      // Scroll to bottom after message is sent
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }, [inputText, chatLoading, sendMessage])

  const handleCodeReviewPrompt = useCallback(async () => {
    if (promptLoading || chatLoading) return

    try {
      const result = await getPrompt('code_review', {
        file_path: 'app/screens/InboxScreen.tsx',
        style_guide: 'React Native best practices'
      })
      
      // Add the response messages to the chat
      if (result.messages) {
        for (const msg of result.messages) {
          await sendMessage(msg.content)
        }
      }
      
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } catch (err) {
      console.error('Failed to send code review prompt:', err)
    }
  }, [promptLoading, chatLoading, getPrompt, sendMessage])

  if (!chatConnected || !promptConnected) {
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
      <View style={styles.promptButtonContainer}>
        <TouchableOpacity
          style={[styles.promptButton, (promptLoading || chatLoading) && styles.promptButtonDisabled]}
          onPress={handleCodeReviewPrompt}
          disabled={promptLoading || chatLoading}
        >
          <Text style={[styles.promptButtonText, (promptLoading || chatLoading) && styles.promptButtonTextDisabled]}>
            Code Review This File
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {(chatLoading || promptLoading) && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        )}
        {(chatError || promptError) && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{chatError || promptError}</Text>
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
            (!inputText.trim() || chatLoading) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || chatLoading}
        >
          <Text style={[
            styles.sendButtonText,
            (!inputText.trim() || chatLoading) && styles.sendButtonTextDisabled
          ]}>
            {chatLoading ? "..." : "Send"}
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
  promptButtonContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  promptButton: {
    backgroundColor: colors.palette.accent300,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  promptButtonDisabled: {
    backgroundColor: '#333',
  },
  promptButtonText: {
    color: '#fff',
    fontFamily: typography.primary.medium,
    fontSize: 16,
  },
  promptButtonTextDisabled: {
    color: '#666',
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
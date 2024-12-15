import { observer } from "mobx-react-lite"
import { FC, useCallback, useRef, useState } from "react"
import {
    Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View
} from "react-native"
import { Screen, Text } from "@/components"
import { ChatMessage } from "@/components/ChatMessage"
import { FileExplorer } from "@/components/FileExplorer"
import { AppStackScreenProps } from "@/navigators"
import { useOllamaChat } from "@/services/ollama/useOllamaChat"
import { useWebSocket } from "@/services/websocket/useWebSocket"
import { typography } from "@/theme"
import { colors } from "@/theme/colorsDark"
import { pylonConfig } from "@/config/websocket"

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

  const { readResource } = useWebSocket(pylonConfig)

  const inputRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [inputText, setInputText] = useState("")
  const [showFilePicker, setShowFilePicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  const handleFileSelect = useCallback((resource: { uri: string, mime_type?: string }) => {
    if (resource.mime_type) {
      // It's a file, not a directory
      const url = new URL(resource.uri)
      const rootPath = '/home/atlantispleb/code/pylon/'
      const relativePath = url.pathname.replace(rootPath, '')
      setSelectedFile(relativePath)
      setShowFilePicker(false)
    }
  }, [])

  const handleCodeReviewPrompt = useCallback(async () => {
    if (chatLoading || loading || !selectedFile) return

    setLoading(true)
    try {
      // First read the file content
      const fileContent = await readResource(selectedFile)
      
      // Send the code review prompt with file content
      const prompt = `You are a code reviewer examining the following file: ${selectedFile}

Please review this code following best practices and suggest improvements for:
1. Performance
2. Code organization
3. React/TypeScript usage
4. Error handling
5. UI/UX patterns

Format your response with clear sections and code examples where relevant.

Here's the file content:

${fileContent.content}
`
      await sendMessage(prompt)
      scrollViewRef.current?.scrollToEnd({ animated: true })
    } catch (err) {
      console.error('Failed to send code review prompt:', err)
    } finally {
      setLoading(false)
    }
  }, [chatLoading, loading, selectedFile, readResource, sendMessage])

  if (!chatConnected) {
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
          style={[styles.promptButton, !selectedFile && styles.promptButtonDisabled]}
          onPress={() => setShowFilePicker(true)}
          disabled={chatLoading || loading}
        >
          <Text style={[styles.promptButtonText, !selectedFile && styles.promptButtonTextDisabled]}>
            {selectedFile ? `Review: ${selectedFile}` : 'Select File to Review'}
          </Text>
        </TouchableOpacity>
        {selectedFile && (
          <TouchableOpacity
            style={[styles.promptButton, (chatLoading || loading) && styles.promptButtonDisabled]}
            onPress={handleCodeReviewPrompt}
            disabled={chatLoading || loading}
          >
            <Text style={[styles.promptButtonText, (chatLoading || loading) && styles.promptButtonTextDisabled]}>
              Start Review
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {(chatLoading || loading) && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        )}
        {chatError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{chatError}</Text>
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

      <Modal
        visible={showFilePicker}
        animationType="slide"
        onRequestClose={() => setShowFilePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFilePicker(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select File to Review</Text>
          </View>
          <FileExplorer onSelectFile={handleFileSelect} />
        </View>
      </Modal>
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
    gap: 8,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalCloseButton: {
    marginRight: 16,
  },
  modalCloseText: {
    color: colors.palette.accent200,
    fontFamily: typography.primary.medium,
    fontSize: 16,
  },
  modalTitle: {
    color: '#fff',
    fontFamily: typography.primary.medium,
    fontSize: 18,
    flex: 1,
  },
});
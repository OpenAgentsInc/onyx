import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native"
import { Message } from "@ai-sdk/react"
import Clipboard from "@react-native-clipboard/clipboard"
import { MessageContent } from "./markdown/MessageContent"
import { styles as baseStyles } from "./styles"

interface ChatOverlayProps {
  messages: Message[]
  isLoading: boolean
  error?: string
}

export const ChatOverlay = observer(({ messages, isLoading, error }: ChatOverlayProps) => {
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const copyToClipboard = (content: string) => {
    Clipboard.setString(content)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
      style={baseStyles.chatOverlay}
    >
      <ScrollView
        ref={scrollViewRef}
        style={baseStyles.messageList}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        {messages.map((message: Message) => (
          <TouchableOpacity
            key={message.id}
            onPress={() => copyToClipboard(message.content)}
            activeOpacity={1}
          >
            <View style={baseStyles.message}>
              <MessageContent message={message} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && (
        <Image
          source={require("../../assets/images/Thinking-Animation.gif")}
          style={{
            position: "absolute",
            top: 18,
            right: 10,
            width: 40,
            height: 40,
            zIndex: 1000,
          }}
        />
      )}
    </KeyboardAvoidingView>
  )
})

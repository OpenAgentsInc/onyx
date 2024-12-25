import { isLoading } from "expo-font"
import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import { ScrollView, TouchableOpacity, View, Image } from "react-native"
import { Message } from "@ai-sdk/react"
import Clipboard from "@react-native-clipboard/clipboard"
import { MessageContent } from "./markdown/MessageContent"
import { styles as baseStyles } from "./styles"

interface ChatOverlayProps {
  messages: Message[]
  isLoading: boolean
  error: string
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
    <View style={baseStyles.chatOverlay}>
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
        {isLoading && (
          <Image 
            source={require("../../assets/images/Thinking-Animation.gif")}
            style={{ 
              position: "absolute", 
              bottom: 20, 
              right: 20,
              width: 24,
              height: 24
            }} 
          />
        )}
      </ScrollView>
    </View>
  )
})
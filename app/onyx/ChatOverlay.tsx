import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Message, useChat } from "@ai-sdk/react"
import Clipboard from "@react-native-clipboard/clipboard"
import { MessageContent } from "./markdown/MessageContent"
import { styles as baseStyles } from "./styles"

export const ChatOverlay = observer(() => {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: "https://nexus.openagents.com/chat",
    onError: (error) => console.error(error, "ERROR"),
  })

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
            activeOpacity={0.7}
          >
            <View style={baseStyles.message}>
              <MessageContent message={message} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
})

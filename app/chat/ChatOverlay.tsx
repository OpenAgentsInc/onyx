import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { MessageContent } from "@/onyx/markdown/MessageContent"
import { styles as baseStyles } from "@/onyx/styles"
import { Message } from "@ai-sdk/react"
import Clipboard from "@react-native-clipboard/clipboard"

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
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        style={[baseStyles.messageList, { flex: 1 }]}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        keyboardShouldPersistTaps="never"
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
    </View>
  )
})

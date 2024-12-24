import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import { ScrollView, Text, View, TouchableOpacity } from "react-native"
import Clipboard from "@react-native-clipboard/clipboard"
import { useStores } from "@/models"
import { styles as baseStyles } from "./styles"
import { IMessage } from "@/models/chat/ChatStore"

export const ChatOverlay = observer(() => {
  const { chatStore } = useStores()
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [chatStore.currentMessages])

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
        {chatStore.currentMessages.map((message: IMessage) => (
          <TouchableOpacity
            key={message.id}
            onPress={() => copyToClipboard(message.content)}
            activeOpacity={0.7}
          >
            <View style={baseStyles.message}>
              <Text style={baseStyles.messageText}>
                {message.role === "user" ? "> " : ""}
                {message.content}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
})
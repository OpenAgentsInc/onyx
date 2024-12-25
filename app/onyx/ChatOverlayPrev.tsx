import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { useStores } from "@/models"
import { IMessage } from "@/models/chat/ChatStore"
import { log } from "@/utils/log"
import Clipboard from "@react-native-clipboard/clipboard"
import { MessageContent } from "./markdown/MessageContent"
import { styles as baseStyles } from "./styles"

export const ChatOverlay = observer(() => {
  const { chatStore, toolStore } = useStores()
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Initialize tools if not already initialized
    const initTools = async () => {
      if (!toolStore.isInitialized) {
        try {
          await toolStore.initializeDefaultTools()
          log({
            name: "[ChatOverlay] Tools initialized",
            preview: "Tools ready",
            value: { tools: toolStore.tools.map((t) => t.id) },
            important: true,
          })
        } catch (err) {
          log.error("[ChatOverlay] Failed to initialize tools:", err)
        }
      }
    }
    initTools()
  }, [toolStore])

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
              {/* @ts-ignore */}
              <MessageContent message={message} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
})

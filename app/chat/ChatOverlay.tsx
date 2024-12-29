import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { AutoImage } from "@/components/AutoImage"
import { images } from "@/theme/images"
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
  }, [messages, isLoading])

  const copyToClipboard = (content: string) => {
    Clipboard.setString(content)
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
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
        <AutoImage
          source={images.thinking}
          maxHeight={80}
          maxWidth={80}
          height={40}
          width={40}
          style={{
            backgroundColor: "black",
          }}
        />
      </ScrollView>
    </View>
  )
})

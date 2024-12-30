import { useRef, useState } from "react"
import { Keyboard, Pressable, TextInput, View } from "react-native"
import { ThinkingAnimation } from "@/components/ThinkingAnimation"
import { useKeyboard } from "@/hooks/useKeyboard"
import { useVoiceRecording } from "@/hooks/useVoiceRecording"
import { colorsDark as colors } from "@/theme"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

interface ChatBarProps {
  handleSendMessage: (message: string) => void
}

export const ChatBar = ({ handleSendMessage }: ChatBarProps) => {
  const [height, setHeight] = useState(24)
  const [text, setText] = useState("")
  const sendImmediatelyRef = useRef(false)
  const { isOpened: expanded, show, ref } = useKeyboard()
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording(
    (transcription) => {
      const trimmedTranscription = transcription.trim()
      if (sendImmediatelyRef.current) {
        // Send all accumulated text plus new transcription
        const existingText = text.trim()
        const fullMessage = existingText
          ? `${existingText} ${trimmedTranscription}`
          : trimmedTranscription
        handleSendMessage(fullMessage)
        setText("")
        sendImmediatelyRef.current = false
      } else {
        setText((prev) => {
          if (!prev.trim()) return trimmedTranscription
          return `${prev.trim()} ${trimmedTranscription}`
        })
      }
    },
  )

  const updateSize = (event) => {
    const newHeight = Math.min(event.nativeEvent.contentSize.height, 240)
    setHeight(newHeight)
  }

  const handleMicPress = async (e) => {
    e.stopPropagation()
    if (isRecording) {
      sendImmediatelyRef.current = false
      await stopRecording()
    } else {
      await startRecording()
    }
  }

  const handleSendPress = async (e) => {
    e.stopPropagation()
    if (isRecording) {
      sendImmediatelyRef.current = true
      await stopRecording()
    } else if (text.trim()) {
      handleSendMessage(text)
      setText("")
      Keyboard.dismiss()
    }
  }

  const handleBarPress = () => {
    if (!expanded) {
      show()
    }
  }

  return (
    <View
      style={{
        borderRadius: 10,
        marginHorizontal: 10,
        backgroundColor: colors.backgroundSecondary,
        paddingVertical: 8,
        paddingHorizontal: 8,
        minHeight: 50,
        zIndex: 4,
        marginBottom: 10,
      }}
    >
      <Pressable
        onPress={handleBarPress}
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          minHeight: 34,
        }}
      >
        <Pressable
          onPress={handleMicPress}
          style={{
            marginRight: 16,
            backgroundColor: isRecording ? "white" : "transparent",
            borderRadius: 36,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={isProcessing}
        >
          <FontAwesome name="microphone" size={20} color={isRecording ? "black" : "#666"} />
        </Pressable>

        <View style={{ flex: 1, minHeight: 34 }}>
          <TextInput
            ref={ref}
            spellCheck={false}
            multiline
            style={{
              color: "white",
              fontSize: 16,
              fontFamily: typography.primary.normal,
              opacity: expanded ? 1 : 0.8,
              minHeight: 34,
              maxHeight: 240,
            }}
            editable={!isRecording}
            onContentSizeChange={updateSize}
            placeholder={isRecording ? "Recording..." : "Message"}
            placeholderTextColor="#666"
            onChangeText={setText}
            value={text}
            onPressIn={handleBarPress}
          />
          {isProcessing && (
            <View style={{ position: "absolute", right: 0, bottom: 9 }}>
              <ThinkingAnimation size={16} />
            </View>
          )}
        </View>

        <Pressable
          onPress={handleSendPress}
          style={{
            backgroundColor: text.trim() || isRecording ? "white" : "transparent",
            borderRadius: 28,
            width: 28,
            height: 28,
            marginLeft: 12,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <AntDesign
            name="arrowup"
            size={20}
            color={text.trim() || isRecording ? "black" : "#666"}
          />
        </Pressable>
      </Pressable>
    </View>
  )
}

import { useRef, useState } from "react"
import { Animated, Keyboard, Pressable, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useKeyboard } from "@/hooks/useKeyboard"
import { useVoiceRecording } from "@/hooks/useVoiceRecording"
import { colorsDark as colors } from "@/theme"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"
import { ThinkingAnimation } from "@/components/ThinkingAnimation"

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
        setText(prev => {
          if (!prev.trim()) return trimmedTranscription
          return `${prev.trim()} ${trimmedTranscription}`
        })
      }
    }
  )

  const insets = useSafeAreaInsets()

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

  // Calculate container height based on content height
  const containerHeight = Math.max(50, Math.min(height + 16, 300))

  return (
    <View
      style={{
        borderRadius: 20,
        marginHorizontal: 20,
        backgroundColor: colors.backgroundSecondary,
        paddingBottom: 10,
        paddingHorizontal: 14,
        height: containerHeight,
        zIndex: 4,
        marginBottom: expanded ? insets.bottom / 2 : 0,
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={handleBarPress}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <Pressable 
            onPress={handleMicPress} 
            style={{ 
              marginRight: 16, 
              paddingBottom: 5,
              backgroundColor: isRecording ? "white" : "transparent",
              borderRadius: 20,
              padding: 8,
            }}
            disabled={isProcessing}
          >
            <FontAwesome 
              name="microphone" 
              size={20} 
              color={isRecording ? "black" : "#666"} 
            />
          </Pressable>

          <View style={{ flex: 1 }}>
            <TextInput
              ref={ref}
              spellCheck={false}
              multiline
              style={{
                flex: 1,
                color: "white",
                fontSize: 16,
                fontFamily: typography.primary.normal,
                paddingBottom: expanded ? 5 : 4,
                opacity: expanded ? 1 : 0.8,
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
              <View style={{ position: "absolute", right: 0, bottom: expanded ? 5 : 4 }}>
                <ThinkingAnimation size={16} />
              </View>
            )}
          </View>

          <Pressable
            onPress={handleSendPress}
            style={{
              backgroundColor: (text.trim() || isRecording) ? "white" : "transparent",
              borderRadius: 12,
              padding: 4,
              marginLeft: 12,
              marginBottom: 2,
            }}
          >
            <AntDesign name="arrowup" size={20} color={(text.trim() || isRecording) ? "black" : "#666"} />
          </Pressable>
        </Pressable>
      </View>
    </View>
  )
}
import { useEffect, useRef, useState } from "react"
import { Animated, Keyboard, Pressable, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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
  const { isOpened: expanded, show, ref } = useKeyboard()
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording(
    (transcription) => {
      setText(transcription)
      show()
    }
  )

  const insets = useSafeAreaInsets()
  const translateX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isRecording) {
      // Start animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      // Stop animation
      translateX.setValue(0)
    }
  }, [isRecording])

  const updateSize = (event) => {
    const newHeight = Math.min(event.nativeEvent.contentSize.height, 240)
    setHeight(newHeight)
  }

  const handleMicPress = async (e) => {
    e.stopPropagation()
    if (isRecording) {
      await stopRecording()
    } else {
      await startRecording()
    }
  }

  const handleSendPress = (e) => {
    if (!text.trim()) return
    e.stopPropagation()
    handleSendMessage(text)
    setText("")
    Keyboard.dismiss()
  }

  const handleBarPress = () => {
    if (!expanded) {
      show()
    }
  }

  return (
    <View
      style={{
        borderRadius: 20,
        marginHorizontal: 20,
        backgroundColor: colors.backgroundSecondary,
        paddingBottom: 10,
        paddingHorizontal: 14,
        height: expanded ? Math.max(50, Math.min(height + 16, 300)) : 50,
        zIndex: 4,
        marginBottom: expanded ? insets.bottom / 2 : 0,
      }}
    >
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
          }}
          editable={!isRecording}
          onContentSizeChange={updateSize}
          placeholder={isRecording ? "Recording..." : "Message"}
          placeholderTextColor="#666"
          onChangeText={setText}
          value={text}
          onPressIn={handleBarPress}
        />

        <Pressable
          onPress={handleSendPress}
          style={{
            backgroundColor: text.trim() ? "white" : "transparent",
            borderRadius: 12,
            padding: 4,
            marginLeft: 12,
            marginBottom: 2,
          }}
        >
          <AntDesign name="arrowup" size={20} color={text.trim() ? "black" : "#666"} />
        </Pressable>
      </Pressable>

      {isRecording && (
        <View 
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: "50%",
            height: 2,
            backgroundColor: "rgba(255,255,255,0.2)",
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "30%",
              backgroundColor: "white",
              borderRadius: 2,
              transform: [{
                translateX: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 200] // Adjust these values to control animation width
                })
              }],
            }}
          />
        </View>
      )}
    </View>
  )
}
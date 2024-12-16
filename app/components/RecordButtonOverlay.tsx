import { FC } from "react"
import { TouchableOpacity, Animated, View, ViewStyle } from "react-native"
import { Icon } from "./Icon"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useCallback, useEffect, useRef } from "react"
import { useAppTheme } from "@/utils/useAppTheme"
import { useLlamaVercelChat } from "@/hooks/useLlamaVercelChat"
import { useStores } from "@/models"
import { StatusIndicator } from "./StatusIndicator"
import { colors } from "@/theme"

const BUTTON_SIZE = 65

export const RecordButtonOverlay: FC = () => {
  const {
    theme: { colors: themeColors },
  } = useAppTheme()
  const { isRecording, toggleRecording, recordingUri } = useAudioRecorder()
  const { append, isLoading: isModelLoading } = useLlamaVercelChat()
  const { recordingStore } = useStores()
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isRecording) {
      // Scale animation for border
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      // Reset animations
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [isRecording])

  const handlePress = useCallback(async () => {
    if (isModelLoading) return // Prevent recording while model is loading
    
    const uri = await toggleRecording()
    
    if (uri && !isRecording) {
      try {
        recordingStore.setProp("isTranscribing", true)
        console.log("Starting transcription...")
        const transcription = await recordingStore.transcribeRecording()
        console.log("Transcription result:", transcription)

        if (transcription) {
          await append({ role: "user", content: transcription })
        }
      } catch (err) {
        console.error('Failed to process recording:', err)
      } finally {
        recordingStore.setProp("isTranscribing", false)
      }
    }
  }, [toggleRecording, isRecording, append, recordingStore, isModelLoading])

  return (
    <View style={$container}>
      <StatusIndicator 
        isModelLoading={isModelLoading}
        isTranscribing={recordingStore.isTranscribing}
      />
      <TouchableOpacity
        onPress={handlePress}
        style={$buttonContainer}
        activeOpacity={0.8}
      >
        <View style={[$button, isModelLoading && $buttonLoading]}>
          <Icon
            icon="mic"
            size={36}
            color={isRecording ? "#fff" : themeColors.tint}
            style={{ borderRadius: 12, marginTop: -1 }}
          />
        </View>
        {isRecording && (
          <Animated.View
            style={[
              $recordingBorder,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

const $container: ViewStyle = {
  position: "absolute",
  bottom: 55,
  left: 0,
  right: 0,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
}

const $buttonContainer: ViewStyle = {
  width: BUTTON_SIZE + 20, // Increased to accommodate recording border
  height: BUTTON_SIZE + 20,
  alignItems: "center",
  justifyContent: "center",
}

const $recordingBorder: ViewStyle = {
  position: "absolute",
  width: BUTTON_SIZE + 20,
  height: BUTTON_SIZE + 20,
  borderRadius: (BUTTON_SIZE + 20) / 2,
  borderWidth: 3,
  borderColor: colors.error,
  backgroundColor: "transparent",
}

const $button: ViewStyle = {
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  borderRadius: BUTTON_SIZE / 2,
  backgroundColor: "black",
  borderWidth: 1,
  borderColor: "#666",
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#fff",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  elevation: 5,
  zIndex: 2,
}

const $buttonLoading: ViewStyle = {
  backgroundColor: "#333",
  borderColor: "#999",
  opacity: 0.5,
}
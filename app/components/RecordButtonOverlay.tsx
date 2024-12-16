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
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isRecording) {
      // Pulse animation for recording state
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()

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
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
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
        <Animated.View 
          style={[
            $button, 
            isRecording && $buttonRecording, 
            isModelLoading && $buttonLoading,
            isRecording && {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Icon
            icon="mic"
            size={36}
            color={isRecording ? "#fff" : themeColors.tint}
            style={{ borderRadius: 12, marginTop: -1 }}
          />
        </Animated.View>
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
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  alignItems: "center",
  justifyContent: "center",
}

const $recordingBorder: ViewStyle = {
  position: "absolute",
  width: BUTTON_SIZE + 10,
  height: BUTTON_SIZE + 10,
  borderRadius: (BUTTON_SIZE + 10) / 2,
  borderWidth: 2,
  borderColor: colors.error,
  backgroundColor: "rgba(255,0,0,0.1)",
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
}

const $buttonRecording: ViewStyle = {
  backgroundColor: colors.error,
  borderColor: "#fff",
  shadowColor: colors.error,
  shadowOpacity: 0.6,
  shadowRadius: 16,
  elevation: 8,
}

const $buttonLoading: ViewStyle = {
  backgroundColor: "#333",
  borderColor: "#999",
  opacity: 0.5,
}
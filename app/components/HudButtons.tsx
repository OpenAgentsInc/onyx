import { View, StyleSheet } from "react-native"
import { VectorIcon } from "./VectorIcon"
import { colors } from "@/theme/colorsDark"
import { useAudioRecorder } from "../hooks/useAudioRecorder"
import { observer } from "mobx-react-lite"
import { Audio } from "expo-av"
import { useState } from "react"
import { useStores } from "../models"

export interface HudButtonsProps {
  onChatPress?: () => void
}

export const HudButtons = observer(({ onChatPress }: HudButtonsProps) => {
  const { isRecording, recordingUri, toggleRecording } = useAudioRecorder()
  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const { recordingStore } = useStores()

  const playLastRecording = async () => {
    if (!recordingUri) return

    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync()
      }

      console.log("Loading sound...")
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      )
      setSound(newSound)
      setIsPlaying(true)

      // Handle playback finished
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status && "didJustFinish" in status && status.didJustFinish) {
          setIsPlaying(false)
        }
      })

      await newSound.playAsync()
    } catch (err) {
      console.error("Failed to play recording:", err)
      setIsPlaying(false)
    }
  }

  const stopPlaying = async () => {
    if (sound) {
      await sound.stopAsync()
      await sound.unloadAsync()
      setSound(null)
      setIsPlaying(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <VectorIcon
          name="mic"
          size={28}
          color={isRecording ? colors.palette.angry500 : "white"}
          containerStyle={[
            styles.button,
            isRecording && styles.recordingButton
          ]}
          onPress={toggleRecording}
        />
        {recordingUri && (
          <VectorIcon
            name={isPlaying ? "stop" : "play-arrow"}
            size={28}
            color="white"
            containerStyle={[
              styles.button,
              isPlaying && styles.playingButton
            ]}
            onPress={isPlaying ? stopPlaying : playLastRecording}
          />
        )}
        <VectorIcon
          name="chat"
          size={28}
          color="white"
          containerStyle={styles.button}
          onPress={onChatPress}
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: colors.palette.neutral300,
    justifyContent: "center",
    alignItems: "center",
  },
  recordingButton: {
    borderColor: colors.palette.angry500,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  playingButton: {
    borderColor: colors.palette.accent300,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
})
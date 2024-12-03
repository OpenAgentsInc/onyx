import { View, StyleSheet } from "react-native"
import { VectorIcon } from "./VectorIcon"
import { colors } from "@/theme/colorsDark"
import { useAudioRecorder } from "../hooks/useAudioRecorder"
import { observer } from "mobx-react-lite"

export interface HudButtonsProps {
  onChatPress?: () => void
}

export const HudButtons = observer(({ onChatPress }: HudButtonsProps) => {
  const { isRecording, toggleRecording } = useAudioRecorder()

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
})
import { View, StyleSheet, Text } from "react-native"
import { VectorIcon } from "./VectorIcon"
import { colors } from "@/theme/colorsDark"
import { useAudioRecorder } from "../hooks/useAudioRecorder"
import { observer } from "mobx-react-lite"

export interface HudButtonsProps {
  onChatPress?: () => void
}

export const HudButtons = observer(({ onChatPress }: HudButtonsProps) => {
  const { isRecording, recordingUri, toggleRecording } = useAudioRecorder()

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
      
      {/* Status Display */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isRecording ? "Recording..." : "Not Recording"}
        </Text>
        {recordingUri && (
          <Text style={styles.uriText} numberOfLines={1} ellipsizeMode="middle">
            Last Recording: {recordingUri}
          </Text>
        )}
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
    marginBottom: 10,
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
  statusContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  uriText: {
    color: colors.palette.neutral400,
    fontSize: 12,
    width: "100%",
    textAlign: "center",
  },
})
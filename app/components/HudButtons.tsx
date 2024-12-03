import { View, StyleSheet } from "react-native"
import { VectorIcon } from "./VectorIcon"

export interface HudButtonsProps {
  onMicPress?: () => void
  onChatPress?: () => void
}

export function HudButtons({ onMicPress, onChatPress }: HudButtonsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <VectorIcon
          name="mic"
          size={28}
          color="white"
          containerStyle={styles.button}
          onPress={onMicPress}
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
}

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
    justifyContent: "center",
    alignItems: "center",
  },
})
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, StyleSheet } from "react-native"
import { MainTabScreenProps } from "@/navigators"
import { Canvas } from "@/components/Canvas"
import { HudButtons } from "@/components/HudButtons"
import { ChatOverlay } from "@/components/ChatOverlay"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  const { isRecording, toggleRecording } = useAudioRecorder()

  const handleMicPress = async () => {
    await toggleRecording()
  }

  const handleChatPress = () => {
    // Toggle chat visibility if needed
    console.log("Chat pressed")
  }

  return (
    <View style={styles.container}>
      <Canvas />
      <ChatOverlay />
      <HudButtons
        onMicPress={handleMicPress}
        onChatPress={handleChatPress}
        isRecording={isRecording}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})
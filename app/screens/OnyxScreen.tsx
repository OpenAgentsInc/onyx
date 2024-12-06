import { observer } from "mobx-react-lite"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { Canvas } from "@/components/Canvas"
import { HudButtons } from "@/components/HudButtons"
import { NexusOverlay } from "@/components/NexusOverlay"
import NIP90Overlay from "@/components/NIP90Overlay"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useStores } from "@/models"
import { MainTabScreenProps } from "@/navigators"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  const { isRecording, toggleRecording } = useAudioRecorder()
  const { chatStore } = useStores()

  const handleMicPress = async () => {
    await toggleRecording()
  }

  const handleChatPress = () => {
    chatStore.toggleFullChat()
  }

  return (
    <View style={styles.container}>
      <Canvas />
      {/* <NexusOverlay /> */}
      <NIP90Overlay />
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

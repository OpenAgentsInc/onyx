import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, StyleSheet } from "react-native"
import { MainTabScreenProps } from "@/navigators"
import { Canvas } from "@/components/Canvas"
import { HudButtons } from "@/components/HudButtons"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  const handleMicPress = () => {
    // TODO: Implement mic functionality
    console.log("Mic pressed")
  }

  const handleChatPress = () => {
    // TODO: Implement chat functionality
    console.log("Chat pressed")
  }

  return (
    <View style={styles.container}>
      <Canvas />
      <HudButtons
        onMicPress={handleMicPress}
        onChatPress={handleChatPress}
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
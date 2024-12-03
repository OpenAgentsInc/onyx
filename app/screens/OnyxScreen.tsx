import { observer } from "mobx-react-lite"
import { FC } from "react"
import { StyleSheet } from "react-native"
import { Screen } from "@/components"
import { MainTabScreenProps } from "@/navigators"
import { Canvas } from "@/components/Canvas"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  return (
    <Screen
      style={styles.root}
      contentContainerStyle={styles.content}
      preset="fixed"
      safeAreaEdges={[]}
    >
      <Canvas />
    </Screen>
  )
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
})
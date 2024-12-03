import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, StyleSheet } from "react-native"
import { MainTabScreenProps } from "@/navigators"
import { Canvas } from "@/components/Canvas"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  return (
    <View style={styles.container}>
      <Canvas />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { Canvas } from "@/components/Canvas"
import { useAutoUpdate } from "@/hooks/useAutoUpdate"
import { AppStackScreenProps } from "@/navigators"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface OnyxFullScreenProps extends AppStackScreenProps<"OnyxFull"> { }

export const OnyxFullScreen: FC<OnyxFullScreenProps> = observer(function OnyxFullScreen() {
  // Initialize auto-update functionality
  useAutoUpdate();

  return (
    <Screen style={$root} preset="fixed">
      <View style={$canvasContainer}>
        <Canvas />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $canvasContainer: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
}

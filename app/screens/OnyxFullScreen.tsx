import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Canvas } from "@/components/Canvas"
import { ChatOverlay } from "@/components/ChatOverlay"
import { useAutoUpdate } from "@/hooks/useAutoUpdate"
import { AppStackScreenProps } from "@/navigators"

interface OnyxFullScreenProps extends AppStackScreenProps<"OnyxFull"> { }

export const OnyxFullScreen: FC<OnyxFullScreenProps> = observer(function OnyxFullScreen() {
  useAutoUpdate();

  return (
    <View style={$root}>
      <Canvas />
      <ChatOverlay />
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
}

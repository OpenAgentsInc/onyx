import { FC } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useAutoUpdate } from "@/hooks/useAutoUpdate"

interface OnyxFullScreenProps extends AppStackScreenProps<"OnyxFull"> {}

export const OnyxFullScreen: FC<OnyxFullScreenProps> = observer(function OnyxFullScreen() {
  // Initialize auto-update functionality
  useAutoUpdate();
  
  return (
    <Screen style={$root} preset="scroll">
      <Text text="onyxFull" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
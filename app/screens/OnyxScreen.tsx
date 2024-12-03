import { observer } from "mobx-react-lite"
import { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { MainTabScreenProps } from "@/navigators"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <Text text="Ready" style={$headerText} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingBottom: 40,
}

const $headerText: TextStyle = {
  position: 'absolute',
  top: '50%',
  color: 'white',
  fontSize: 18,
}

import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle, TextStyle } from "react-native"
import { Screen, Text } from "@/components"
import { Updater } from "@/components/Updater"
import { ProfileMenuScreenProps } from "@/navigators/ProfileMenuNavigator"

interface UpdaterScreenProps extends ProfileMenuScreenProps<"Updater"> { }

export const UpdaterScreen: FC<UpdaterScreenProps> = observer(function UpdaterScreen() {
  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="scroll"
    >
      <Text text="App Updates" style={$headerText} />
      <Updater />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $contentContainer: ViewStyle = {
  flex: 1,
}

const $headerText: TextStyle = {
  color: 'white',
  fontSize: 24,
  textAlign: 'center',
  marginVertical: 16,
}
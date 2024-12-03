import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { MainTabScreenProps } from "@/navigators"
import { Updater } from "@/components/Updater"

interface ProfileScreenProps extends MainTabScreenProps<"Profile"> { }

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="scroll"
    >
      <Text text="Profile" style={$headerText} />
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

const $headerText = {
  color: 'white',
  fontSize: 24,
  textAlign: 'center',
  marginVertical: 16,
}
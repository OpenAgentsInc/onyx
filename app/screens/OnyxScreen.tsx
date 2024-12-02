import { observer } from "mobx-react-lite"
import { FC } from "react"
import { TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Screen, Text } from "@/components"
import { MainTabScreenProps } from "@/navigators"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface OnyxScreenProps extends MainTabScreenProps<"Onyx"> { }

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <Text text="Awaiting instruction" style={$headerText} />
      <TouchableOpacity style={$recordButton} onPress={() => console.log('Record pressed')} activeOpacity={0.8}>
        <MaterialCommunityIcons name="record-circle-outline" size={64} color="white" />
      </TouchableOpacity>
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

const $recordButton: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
}
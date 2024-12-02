import { observer } from "mobx-react-lite"
import { FC } from "react"
import { TouchableOpacity, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface OnyxScreenProps extends AppStackScreenProps<"Main"> { }

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

const $headerText: ViewStyle = {
  position: 'absolute',
  top: '50%',
}

const $recordButton: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
}

import { FC } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TouchableOpacity } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface OnyxScreenProps extends AppStackScreenProps<"Onyx"> {}

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  return (
    <Screen style={$root} preset="fixed">
      <Text text="Awaiting instruction" style={$headerText} />
      <TouchableOpacity style={$recordButton} onPress={() => console.log('Record pressed')}>
        <MaterialCommunityIcons name="record-circle-outline" size={64} color="white" />
      </TouchableOpacity>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 40,
}

const $headerText: ViewStyle = {
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
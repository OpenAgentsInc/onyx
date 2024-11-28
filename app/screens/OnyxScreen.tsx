import { FC } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TouchableOpacity, View } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface OnyxScreenProps extends AppStackScreenProps<"Onyx"> {}

export const OnyxScreen: FC<OnyxScreenProps> = observer(function OnyxScreen() {
  return (
    <Screen 
      style={$root} 
      preset="fixed"
      safeAreaEdges={["top"]}
    >
      <Text text="Awaiting instruction" style={$headerText} />
      <View style={$bottomContainer}>
        <TouchableOpacity style={$recordButton} onPress={() => console.log('Record pressed')}>
          <MaterialCommunityIcons name="record-circle-outline" size={64} color="white" />
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $headerText: ViewStyle = {
  color: 'white',
  fontSize: 18,
  textAlign: 'center',
  marginTop: 40,
}

const $bottomContainer: ViewStyle = {
  position: 'absolute',
  bottom: 50,
  left: 0,
  right: 0,
  alignItems: 'center',
}

const $recordButton: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
}
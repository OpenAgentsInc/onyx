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
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$contentContainer}>
        <Text text="Awaiting instruction" style={$headerText} />
        <View style={$bottomSection}>
          <TouchableOpacity style={$recordButton} onPress={() => console.log('Record pressed')}>
            <MaterialCommunityIcons name="record-circle-outline" size={64} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $contentContainer: ViewStyle = {
  flex: 1,
  paddingTop: 40,
  paddingBottom: 80,
  alignItems: 'center',
  justifyContent: 'space-between',
}

const $headerText: ViewStyle = {
  color: 'white',
  fontSize: 18,
}

const $bottomSection: ViewStyle = {
  width: '100%',
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
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { Screen, Text } from "@/components"
import { Updater } from "@/components/Updater"
import { ProfileMenuScreenProps } from "@/navigators/ProfileMenuNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface UpdaterScreenProps extends ProfileMenuScreenProps<"Updater"> { }

export const UpdaterScreen: FC<UpdaterScreenProps> = observer(function UpdaterScreen({ navigation }) {
  const { top } = useSafeAreaInsets()

  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="scroll"
      safeAreaEdges={["bottom"]}
    >
      <View style={[$header, { paddingTop: top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backButton}>
          <Text text="←" style={$backButtonText} />
        </TouchableOpacity>
        <Text text="App Updates" style={$headerText} />
        <View style={$placeholder} />
      </View>
      
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

const $header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomWidth: 1,
  borderBottomColor: "#333",
  paddingHorizontal: 16,
  height: 44,
}

const $headerText: TextStyle = {
  color: 'white',
  fontSize: 18,
  fontWeight: "600",
  flex: 1,
  textAlign: "center",
}

const $backButton: ViewStyle = {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}

const $backButtonText: TextStyle = {
  color: "white",
  fontSize: 28,
}

const $placeholder: ViewStyle = {
  width: 40,
}
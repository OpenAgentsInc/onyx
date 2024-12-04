import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { Screen, Text } from "@/components"
import { ProfileMenuScreenProps } from "@/navigators/ProfileMenuNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface ProfileScreenProps extends ProfileMenuScreenProps<"ProfileHome"> { }

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen({ navigation }) {
  const { top } = useSafeAreaInsets()

  const handlePressUpdater = () => {
    navigation.navigate("Updater")
  }

  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="scroll"
      safeAreaEdges={["bottom"]}
    >
      <View style={[$header, { paddingTop: top }]}>
        <View style={$placeholder} />
        <Text text="Profile" style={$headerText} />
        <View style={$placeholder} />
      </View>
      
      <View style={$profileInfo}>
        <Text text="Nostr Public Key" style={$labelText} />
        <Text text="npub1..." style={$valueText} />
      </View>

      <View style={$menuContainer}>
        <TouchableOpacity style={$menuButton} onPress={handlePressUpdater}>
          <Text text="App Updates" style={$menuButtonText} />
        </TouchableOpacity>
        
        {/* Add more menu buttons here as needed */}
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

const $profileInfo: ViewStyle = {
  padding: 16,
  marginBottom: 24,
  borderBottomWidth: 1,
  borderBottomColor: '#333',
}

const $labelText: TextStyle = {
  color: '#888',
  fontSize: 14,
  marginBottom: 4,
}

const $valueText: TextStyle = {
  color: 'white',
  fontSize: 16,
}

const $menuContainer: ViewStyle = {
  padding: 16,
}

const $menuButton: ViewStyle = {
  backgroundColor: '#222',
  padding: 16,
  borderRadius: 8,
  marginBottom: 12,
}

const $menuButtonText: TextStyle = {
  color: 'white',
  fontSize: 16,
  textAlign: 'left',
}

const $placeholder: ViewStyle = {
  width: 40,
}
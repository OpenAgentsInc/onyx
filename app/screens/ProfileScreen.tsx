import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { Screen, Text } from "@/components"
import { ProfileMenuScreenProps } from "@/navigators/ProfileMenuNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { nostrService } from "@/services/nostr/nostr.service"
import { useBreez } from "@/providers/BreezProvider"

interface ProfileScreenProps extends ProfileMenuScreenProps<"ProfileHome"> { }

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen({ navigation }) {
  const { top } = useSafeAreaInsets()
  const { sdk, isInitialized } = useBreez()
  const [npub, setNpub] = useState<string>("Loading...")

  useEffect(() => {
    async function deriveNostrKeys() {
      try {
        if (!isInitialized || !sdk) return

        // Get mnemonic from Breez SDK
        const mnemonic = await sdk.mnemonicPhrase()
        
        // Derive Nostr keys
        const keys = await nostrService.deriveKeys(mnemonic)
        
        // Update state with npub
        setNpub(keys.npub)
      } catch (error) {
        console.error("Failed to derive Nostr keys:", error)
        setNpub("Error loading npub")
      }
    }

    deriveNostrKeys()
  }, [isInitialized, sdk])

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
      <View style={[$headerContainer, { paddingTop: top }]}>
        <View style={$header}>
          <View style={$placeholder} />
          <Text text="Profile" style={$headerText} />
          <View style={$placeholder} />
        </View>
      </View>
      
      <View style={$content}>
        <View style={$profileInfo}>
          <Text text="Nostr Public Key" style={$labelText} />
          <Text text={npub} style={$valueText} numberOfLines={1} ellipsizeMode="middle" />
        </View>

        <View style={$menuContainer}>
          <TouchableOpacity style={$menuButton} onPress={handlePressUpdater}>
            <Text text="App Updates" style={$menuButtonText} />
          </TouchableOpacity>
          
          {/* Add more menu buttons here as needed */}
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
}

const $headerContainer: ViewStyle = {
  backgroundColor: 'black',
  borderBottomWidth: 1,
  borderBottomColor: "#333",
}

const $header: ViewStyle = {
  height: 44,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
}

const $headerText: TextStyle = {
  color: 'white',
  fontSize: 18,
  fontWeight: "600",
  flex: 1,
  textAlign: "center",
}

const $content: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $profileInfo: ViewStyle = {
  marginBottom: 24,
  borderBottomWidth: 1,
  borderBottomColor: '#333',
  paddingBottom: 16,
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
  marginTop: 8,
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
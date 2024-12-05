import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import {
  ActivityIndicator, TextStyle, TouchableOpacity, View, ViewStyle
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"
import { ProfileMenuScreenProps } from "@/navigators/ProfileMenuNavigator"
import { deriveNostrKeys } from "@/services/nostr/placeholder"

interface ProfileScreenProps extends ProfileMenuScreenProps<"ProfileHome"> { }

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen({ navigation }) {
  const { top } = useSafeAreaInsets()
  const { walletStore } = useStores()
  const { isInitialized } = walletStore
  const [npub, setNpub] = useState<string>("Loading...")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNostrKeys = async () => {
      try {
        // TODO: Get actual mnemonic from Breez SDK
        const dummyMnemonic = "leader monkey parrot ring guide accident before fence cannon height naive bean"
        const keys = await deriveNostrKeys(dummyMnemonic)
        setNpub(keys.npub)
      } catch (error) {
        console.error("Failed to derive Nostr keys:", error)
        setNpub("Error loading keys")
      } finally {
        setIsLoading(false)
      }
    }

    loadNostrKeys()
  }, [])

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
          {isLoading ? (
            <ActivityIndicator size="small" color="#888" />
          ) : (
            <Text text={npub} style={$valueText} numberOfLines={1} ellipsizeMode="middle" />
          )}
        </View>

        <View style={$menuContainer}>
          <TouchableOpacity style={$menuButton} onPress={handlePressUpdater}>
            <Text text="App Updates" style={$menuButtonText} />
          </TouchableOpacity>
        </View>

        <View style={$infoContainer}>
          <Text text="Wallet Status" style={$labelText} />
          <Text
            text={isInitialized ? "Connected" : "Disconnected"}
            style={[$valueText, isInitialized ? $successText : $errorText]}
          />
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $contentContainer: ViewStyle = {
  flex: 1,
}

const $headerContainer: ViewStyle = {
  backgroundColor: "black",
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
  color: "white",
  fontSize: 18,
  fontWeight: "600",
  flex: 1,
  textAlign: "center",
  fontFamily: "SpaceGrotesk-Bold",
}

const $content: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $profileInfo: ViewStyle = {
  marginBottom: 24,
  borderBottomWidth: 1,
  borderBottomColor: "#333",
  paddingBottom: 16,
}

const $labelText: TextStyle = {
  color: "#888",
  fontSize: 14,
  marginBottom: 4,
  fontFamily: "SpaceGrotesk-Regular",
}

const $valueText: TextStyle = {
  color: "white",
  fontSize: 16,
  fontFamily: "SpaceGrotesk-Medium",
}

const $menuContainer: ViewStyle = {
  marginTop: 8,
}

const $menuButton: ViewStyle = {
  backgroundColor: "#222",
  padding: 16,
  borderRadius: 8,
  marginBottom: 12,
}

const $menuButtonText: TextStyle = {
  color: "white",
  fontSize: 16,
  textAlign: "left",
  fontFamily: "SpaceGrotesk-Medium",
}

const $placeholder: ViewStyle = {
  width: 40,
}

const $infoContainer: ViewStyle = {
  marginTop: 24,
  padding: 16,
  backgroundColor: "#111",
  borderRadius: 8,
}

const $successText: TextStyle = {
  color: "#44ff44",
}

const $errorText: TextStyle = {
  color: "#ff4444",
}